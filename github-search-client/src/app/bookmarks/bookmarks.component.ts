import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../services/github.service';
import { RepoDto } from '../models/repo.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <strong>Bookmarked Repositories</strong>
      </div>
      <div class="card-body">
        @if (msg) {
          <div class="alert alert-info">{{ msg }}</div>
        }
        @if (bookmarks.length === 0) {
          <div class="text-muted">No bookmarks yet.</div>
        }
        <div class="row">
          @for (b of bookmarks; track b.id) {
            <div class="col-12 mb-2">
              <div class="d-flex align-items-center">
                @if (avatarOf(b)) {
                  <img [src]="avatarOf(b)" style="width:48px;height:48px;object-fit:cover;margin-right:10px" />
                }
                <div class="flex-grow-1">
                  <div><a [href]="htmlUrlOf(b)" target="_blank">{{ displayFullName(b) }}</a></div>
                  <div class="small text-muted">{{ b.description }}</div>
                </div>
                <div>
                  <button class="btn btn-sm btn-danger" (click)="remove(b.id)">Unbookmark</button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class BookmarksComponent implements OnInit {
  bookmarks: RepoDto[] = [];
  msg = '';
  private sub?: Subscription;

  constructor(private svc: GithubService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.load();
    this.sub = this.svc.bookmarksChanged$.subscribe(() => this.load());
  }

  load() {
    this.svc.listBookmarks().subscribe({
      next: (list) => {
        this.bookmarks = (list || []).map(this.normalize);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  remove(id: number) {
    this.svc.removeBookmark(id).subscribe({
      next: (list) => {
        this.bookmarks = (list || []).map(this.normalize);
        this.msg = 'Removed';
        setTimeout(() => { 
          this.msg = '';
          this.cdr.detectChanges();
        }, 1200);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.msg = 'Failed to remove';
        this.cdr.detectChanges();
      }
    });
  }

  normalize = (r: any): RepoDto => {
    return {
      id: r.id,
      name: r.name || r.full_name,
      full_name: (r.full_name || r.fullName || r.name),
      html_url: r.html_url || r.htmlUrl,
      description: r.description,
      owner: {
        login: r.owner?.login,
        avatar_url: r.owner?.avatar_url || r.owner?.avatarUrl
      }
    };
  };

  avatarOf(r: any) {
    return r?.owner?.avatar_url || r?.owner?.avatarUrl;
  }

  htmlUrlOf(r: any) {
    return r?.html_url || r?.htmlUrl;
  }

  displayFullName(r: any) {
    return r?.full_name || r?.fullName || r?.name;
  }
}
