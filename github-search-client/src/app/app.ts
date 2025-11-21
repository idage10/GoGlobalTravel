import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SearchComponent, BookmarksComponent],
  template: `
  <div class="container py-4">
    <h1 class="mb-4">GitHub Repository Search</h1>

    <div class="row">
      <div class="col-md-8">
        <app-search></app-search>
      </div>

      <div class="col-md-4">
        <app-bookmarks></app-bookmarks>
      </div>
    </div>
  </div>
  `
})
export class App {}
