import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepoDto } from '../models/repo.model';
import { Observable, Subject } from 'rxjs';

// Change if your backend runs on a different port or host
const API_BASE = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  // Component can listen to this observable using the Injectable "GithubService" and trigger event after the observable changed 
  private bookmarksChangedSource = new Subject<void>();
  bookmarksChanged$ = this.bookmarksChangedSource.asObservable();

  constructor(private http: HttpClient) {}

  // Search GitHub public API
  searchRepos(q: string): Observable<any> {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}`;
    return this.http.get(url);
  }

  // Bookmarks (server stores in ASP.NET Session)
  addBookmark(repo: RepoDto): Observable<RepoDto[]> {
    return new Observable(observer => {
      this.http.post<RepoDto[]>(`${API_BASE}/gitbookmarks/add`, repo, { withCredentials: true }).subscribe({
        next: res => {
          // notify that bookmarks changed
          this.bookmarksChangedSource.next();
          observer.next(res);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  listBookmarks(): Observable<RepoDto[]> {
    return this.http.get<RepoDto[]>(`${API_BASE}/gitbookmarks/list`, { withCredentials: true });
  }

  removeBookmark(id: number): Observable<RepoDto[]> {
    return this.http.post<RepoDto[]>(`${API_BASE}/gitbookmarks/remove`, { id }, { withCredentials: true });
  }

  // Send email via server (server uses pickup directory or IIS)
  sendEmail(to: string, repo: RepoDto): Observable<any> {
    return this.http.post(`${API_BASE}/email/send`, { to, repo }, { withCredentials: true });
  }
}
