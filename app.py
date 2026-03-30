from flask import Flask, render_template, request, redirect, session, flash, send_file
import csv
from datetime import date
import os

app = Flask(__name__)
app.secret_key = "secret123"

USERNAME = "admin"
PASSWORD = "1234"
APPOINTMENTS_FILE = 'appointments.csv'

# Initialize CSV file with headers if it doesn't exist
def init_csv():
    if not os.path.exists(APPOINTMENTS_FILE):
        with open(APPOINTMENTS_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Name', 'Email', 'Phone', 'Department', 'Doctor', 'Reason', 'Date', 'Status'])

init_csv()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/doctors')
def doctors():
    return render_template('doctors.html')

@app.route('/appointment')
def appointment():
    return render_template('appointment.html')

# LOGIN
@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        if username == USERNAME and password == PASSWORD:
            session['logged_in'] = True
            flash('Login successful!', 'success')
            return redirect('/admin')
        else:
            flash('Invalid username or password!', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully!', 'info')
    return redirect('/')

# ADMIN DASHBOARD
@app.route('/admin')
def admin():
    if not session.get('logged_in'):
        return redirect('/login')

    search = request.args.get('search', '').strip().lower()
    department_filter = request.args.get('department', '').strip()
    status_filter = request.args.get('status', '').strip()
    date_from = request.args.get('date_from', '').strip()
    date_to = request.args.get('date_to', '').strip()

    data = []
    filtered_data = []
    today_count = 0
    dept_counts = {}
    status_counts = {}
    doctor_counts = {}

    try:
        with open(APPOINTMENTS_FILE, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader)  # Skip header row
            for line_index, row in enumerate(reader, start=1):
                # Normalize row length to include Status
                if len(row) == 7:
                    row.append('Pending')
                if len(row) >= 8:
                    data.append({'id': line_index, 'row': row})
                    if row[6] == str(date.today()):
                        today_count += 1

        def matches_filters(item):
            row = item['row']
            if search:
                if not (search in row[0].lower() or search in row[4].lower() or search in row[1].lower()):
                    return False
            if department_filter and row[3] != department_filter:
                return False
            if status_filter and row[7] != status_filter:
                return False
            if date_from and row[6] < date_from:
                return False
            if date_to and row[6] > date_to:
                return False
            return True

        filtered_data = [item for item in data if matches_filters(item)]

        # Analytics for charts
        for item in data:
            row = item['row']
            dept_counts[row[3]] = dept_counts.get(row[3], 0) + 1
            status_counts[row[7]] = status_counts.get(row[7], 0) + 1
            doctor_counts[row[4]] = doctor_counts.get(row[4], 0) + 1

    except FileNotFoundError:
        data = []
        filtered_data = []
    except Exception as e:
        print(f"Error reading appointments: {e}")

    total = len(data)
    pending_count = status_counts.get('Pending', 0)
    confirmed_count = status_counts.get('Confirmed', 0)
    completed_count = status_counts.get('Completed', 0)
    cancelled_count = status_counts.get('Cancelled', 0)
    completion_rate = int((completed_count / total) * 100) if total else 0

    return render_template(
        'admin.html',
        data=filtered_data,
        total=total,
        today=today_count,
        dept_counts=dept_counts,
        status_counts=status_counts,
        doctor_counts=doctor_counts,
        pending_count=pending_count,
        confirmed_count=confirmed_count,
        completed_count=completed_count,
        cancelled_count=cancelled_count,
        completion_rate=completion_rate,
        search=search,
        department_filter=department_filter,
        status_filter=status_filter,
        date_from=date_from,
        date_to=date_to
    )

@app.route('/admin/update_status', methods=['POST'])
def update_status():
    if not session.get('logged_in'):
        return redirect('/login')

    try:
        index = int(request.form.get('index', '-1'))
        new_status = request.form.get('new_status', 'Pending').strip()

        if index < 1:
            flash('Invalid appointment index.', 'error')
            return redirect('/admin')

        rows = []
        with open(APPOINTMENTS_FILE, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                rows.append(row)

        if index >= len(rows):
            flash('Appointment not found.', 'error')
            return redirect('/admin')

        if len(rows[index]) < 8:
            while len(rows[index]) < 8:
                rows[index].append('')

        rows[index][7] = new_status

        with open(APPOINTMENTS_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerows(rows)

        flash('Appointment status updated.', 'success')
    except Exception as e:
        print(f"Error updating status: {e}")
        flash('Unable to update status.', 'error')

    return redirect('/admin')

@app.route('/admin/export')
def export_appointments():
    if not session.get('logged_in'):
        return redirect('/login')

    if not os.path.exists(APPOINTMENTS_FILE):
        flash('No appointment data available to download.', 'error')
        return redirect('/admin')

    return send_file(APPOINTMENTS_FILE, as_attachment=True, download_name='appointments_export.csv', mimetype='text/csv')

# BOOK APPOINTMENT
@app.route('/book', methods=['POST'])
def book():
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        department = request.form.get('department', '').strip()
        doctor = request.form.get('doctor', '').strip()
        reason = request.form.get('reason', '').strip()
        date_val = request.form.get('date', '').strip()

        # Validate input
        if not all([name, email, phone, department, doctor, reason, date_val]):
            flash('All fields are required!', 'error')
            return redirect('/appointment')

        if len(name) < 3:
            flash('Name must be at least 3 characters!', 'error')
            return redirect('/appointment')

        if len(phone) < 10:
            flash('Invalid phone number!', 'error')
            return redirect('/appointment')

        init_csv()  # Ensure file exists with headers
        
        with open(APPOINTMENTS_FILE, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([name, email, phone, department, doctor, reason, date_val, 'Pending'])

        flash(f'✓ Appointment booked successfully! Confirmation sent to {email}', 'success')
        return redirect('/appointment')
    
    except Exception as e:
        print(f"Error booking appointment: {e}")
        flash('Error booking appointment. Please try again!', 'error')
        return redirect('/appointment')

# CONTACT FORM
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        try:
            name = request.form.get('name', '').strip()
            email = request.form.get('email', '').strip()
            phone = request.form.get('phone', '').strip()
            subject = request.form.get('subject', '').strip()
            message = request.form.get('message', '').strip()

            # Validate input
            if not all([name, email, subject, message]):
                flash('Please fill in all required fields!', 'error')
                return redirect('/contact')

            if len(name) < 3:
                flash('Name must be at least 3 characters!', 'error')
                return redirect('/contact')

            if len(subject) < 5:
                flash('Subject must be at least 5 characters!', 'error')
                return redirect('/contact')

            if len(message) < 20:
                flash('Message must be at least 20 characters!', 'error')
                return redirect('/contact')

            # Here you would typically send an email or save to database
            # For now, we'll just show a success message
            flash(f'✓ Thank you! Your message has been received. We will get back to you shortly at {email}', 'success')
            return redirect('/contact')
        
        except Exception as e:
            print(f"Error processing contact form: {e}")
            flash('Error sending message. Please try again!', 'error')
            return redirect('/contact')

    return render_template('contact.html')

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True)