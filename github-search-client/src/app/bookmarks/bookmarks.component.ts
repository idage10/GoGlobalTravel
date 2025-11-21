import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../services/github.service';
import { RepoDto } from '../models/repo.model';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <strong>Bookmarked Repositories</strong>
        <button class="btn btn-sm btn-outline-secondary" (click)="load()">Refresh</button>
      </div>
      <div class="card-body">
        <div *ngIf="msg" class="alert alert-info">{{ msg }}</div>
        <div *ngIf="bookmarks.length === 0" class="text-muted">No bookmarks yet.</div>
        <div class="row">
          <div *ngFor="let b of bookmarks" class="col-12 mb-2">
            <div class="d-flex align-items-center">
              <img *ngIf="avatarOf(b)" [src]="avatarOf(b)" style="width:48px;height:48px;object-fit:cover;margin-right:10px" />
              <div class="flex-grow-1">
                <div><a [href]="htmlUrlOf(b)" target="_blank">{{ displayFullName(b) }}</a></div>
                <div class="small text-muted">{{ b.description }}</div>
              </div>
              <div>
                <button class="btn btn-sm btn-danger" (click)="remove(b.id)">Unbookmark</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookmarksComponent implements OnInit {
  bookmarks: RepoDto[] = [];
  msg = '';

  constructor(private svc: GithubService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.listBookmarks().subscribe({
      next: (list) => {
        this.bookmarks = (list || []).map(this.normalize);
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
        setTimeout(() => this.msg = '', 1200);
      },
      error: (err) => {
        console.error(err);
        this.msg = 'Failed to remove';
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
