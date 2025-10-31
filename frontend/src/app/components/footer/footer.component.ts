import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Needed for routerLink
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>RealEstatePro</h3>
            <p>Your trusted partner in real estate. Find your dream property with us.</p>
          </div>

          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/properties">Properties</a></li>
              <li><a routerLink="/add-property">Add Property</a></li>
              <li><a routerLink="/contact">Contact</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Contact Info</h4>
            <p>📞 +1 (555) 123-4567</p>
            <p>info&#64;realestatepro.com</p> <!-- ✅ Use HTML entity for @ -->
            <p>📍 123 Real Estate Street, City</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2024 RealEstatePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #2c3e50;
      color: white;
      padding: 40px 0 20px;
      margin-top: auto;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 30px;
    }
    .footer-section h3, .footer-section h4 {
      margin-bottom: 15px;
      color: #3498db;
    }
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    .footer-section ul li {
      margin-bottom: 8px;
    }
    .footer-section a {
      color: #bdc3c7;
      text-decoration: none;
      transition: color 0.3s;
    }
    .footer-section a:hover {
      color: #3498db;
    }
    .footer-bottom {
      border-top: 1px solid #34495e;
      padding-top: 20px;
      text-align: center;
      color: #bdc3c7;
    }
  `]
})
export class FooterComponent {}
