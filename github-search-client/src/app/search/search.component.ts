import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../services/github.service';
import { RepoDto } from '../models/repo.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

  <div class="mb-3">
    <div class="input-group">
      <input class="form-control" type="text" placeholder="Search GitHub repositories..."
             [(ngModel)]="query" (keydown.enter)="onSearch()" />
      <button class="btn btn-primary" (click)="onSearch()">Search</button>
    </div>
  </div>
  
  @if(loading) {
    <div class="mb-3">Searching...</div>
  }
  @if(message) {
    <div class="alert alert-info">{{ message }}</div>
  }

  <div class="row">
    @for (r of results; track r.id) {
      <div class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          @if(avatarOf(r)) {
            <img [src]="avatarOf(r)" class="card-img-top" alt="avatar"
               style="height:160px;object-fit:cover" />
          }
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ displayFullName(r) }}</h5>
            <p class="card-text text-truncate flex-grow-1">{{ r.description }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <a [href]="htmlUrlOf(r)" target="_blank" class="btn btn-sm btn-outline-secondary">Open</a>
              <div>
                <button class="btn btn-sm btn-success me-2" (click)="bookmark(r)">Bookmark</button>
                <button class="btn btn-sm btn-primary" (click)="openEmailModal(r)">Send Email</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  </div>

  <!-- Send Email modal -->
  <div class="modal fade" id="sendEmailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Send repository info</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          @if(selectedRepo) {
            <p><strong>Repo:</strong> {{ displayFullName(selectedRepo) }}</p>
          }
          <input type="email" class="form-control mb-2" placeholder="Recipient email" [(ngModel)]="emailTo" />
          @if(emailStatus) {
            <div class="mt-2 alert" [ngClass]="{'alert-success': emailOk, 'alert-danger': !emailOk}">
              {{ emailStatus }}
            </div>
          }
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" (click)="sendEmail()">Send</button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class SearchComponent {
  query = '';
  results: RepoDto[] = [];
  loading = false;
  message = '';

  selectedRepo: RepoDto | null = null;
  emailTo = '';
  emailStatus = '';
  emailOk = false;

  constructor(private svc: GithubService, private cdr: ChangeDetectorRef) {}

  onSearch() {
    if (!this.query || !this.query.trim()) {
      this.message = 'Please enter a search phrase';
      return;
    }
    this.message = '';
    this.loading = true;
    this.svc.searchRepos(this.query).subscribe({
      next: (res: any) => {
        this.results = res.items || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error searching GitHub. Check console.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  avatarOf(r: any): string | undefined {
    return r?.owner?.avatar_url || r?.owner?.avatarUrl;
  }

  htmlUrlOf(r: any): string | undefined {
    return r?.html_url || r?.htmlUrl;
  }

  displayFullName(r: any) {
    return r?.full_name || r?.fullName || r?.name || 'repo';
  }

  bookmark(r: RepoDto) {
    // send the whole repo DTO to server to store in session
    this.svc.addBookmark(this.mapToDto(r)).subscribe({
      next: () => {
        this.message = 'Bookmarked!';
        setTimeout(()=> {
          this.message = '';
          this.cdr.detectChanges(); 
        }, 1500);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed bookmarking';
        this.cdr.detectChanges();
      }
    });
  }

  openEmailModal(r: RepoDto) {
    this.selectedRepo = r;
    this.emailTo = '';
    this.emailStatus = '';
    this.emailOk = false;
    const el = document.getElementById('sendEmailModal');
    if (el) {
      // bootstrap modal show
      const modal = new (window as any).bootstrap.Modal(el);
      modal.show();
    }
  }

  sendEmail() {
    if (!this.selectedRepo) return;
    if (!this.emailTo || !this.emailTo.includes('@')) {
      this.emailStatus = 'Please enter a valid email';
      this.emailOk = false;
      this.cdr.detectChanges();
      return;
    }
    this.svc.sendEmail(this.emailTo, this.mapToDto(this.selectedRepo)).subscribe({
      next: () => {
        this.emailStatus = 'Email queued (check pickup dir).';
        this.emailOk = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.emailStatus = 'Failed to send email';
        this.emailOk = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Map fields to server-side DTO naming (server accepts flexible mapping)
  private mapToDto(r: any): RepoDto {
    return {
      id: r.id,
      name: r.name,
      full_name: r.full_name || r.fullName,
      html_url: r.html_url || r.htmlUrl,
      description: r.description,
      owner: {
        login: r.owner?.login,
        avatar_url: r.owner?.avatar_url || r.owner?.avatarUrl
      }
    };
  }
}
