import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Needed for ngModel/ngForm

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Import CommonModule + FormsModule
  template: `
    <div class="contact-container">
      <h2>Contact Us</h2>
      <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="contact-form">
        <div class="form-group">
          <label>Name *</label>
          <input type="text" [(ngModel)]="contact.name" name="name" required>
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input type="email" [(ngModel)]="contact.email" name="email" required>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input type="tel" [(ngModel)]="contact.phone" name="phone">
        </div>

        <div class="form-group">
          <label>Subject *</label>
          <select [(ngModel)]="contact.subject" name="subject" required>
            <option value="">Select Subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div class="form-group">
          <label>Message *</label>
          <textarea [(ngModel)]="contact.message" name="message" required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!contactForm.form.valid">Send</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .contact-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .form-group label {
      font-weight: bold;
      margin-bottom: 5px;
      display: block;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ddd;
      font-size: 14px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-primary {
      background: #3498db;
      color: white;
    }
    .btn-primary:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
  `]
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  onSubmit(): void {
    console.log('Contact submitted:', this.contact);
    alert('Message sent successfully!');
    this.contact = { name: '', email: '', phone: '', subject: '', message: '' };
  }
}
