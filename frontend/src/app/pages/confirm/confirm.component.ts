import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  standalone: true,
  imports: [HttpClientModule]  // <-- add this
})
export class ConfirmComponent implements OnInit {
  message = 'Confirming...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.http.get(`http://localhost:8000/api/users/confirm/${token}`).subscribe({
        next: (res: any) => {
          this.message = res.status || 'Email confirmed!';
        },
        error: (err) => {
          this.message = err.error?.error || 'Confirmation failed';
        }
      });
    }
  }
}
