import { Component, OnInit } from '@angular/core';
import { ClubService, Club } from '../club.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-club-pages',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './club-pages.component.html',
  styleUrls: ['./club-pages.component.css']
})
export class ClubPagesComponent implements OnInit {
  // Since 'category' and 'tags' are not available, we'll comment them out
  // availableCategories: string[] = [];
  // availableTags: string[] = [];
  

  clubs: Club[] = [];
  filteredClubs: Club[] = [];

  filters = {
    searchText: '',
    // category: '', // Uncomment when 'category' is available
    // selectedTags: new Set<string>() // Uncomment when 'tags' are available
  };

  constructor(private clubService: ClubService) { }

  ngOnInit() {
    this.clubService.getClubs().subscribe(clubs => {
      this.clubs = clubs;
      this.filteredClubs = [...this.clubs];
      // this.extractAvailableCategories(); // Uncomment when 'category' is available
      // this.extractAvailableTags();      // Uncomment when 'tags' are available
    });
  }


  // Commenting out methods related to 'category' and 'tags'

  /*
  private extractAvailableCategories() {
    const categoriesSet = new Set(this.clubs.map(club => club.category));
    this.availableCategories = Array.from(categoriesSet);
  }

  private extractAvailableTags() {
    const tagsSet = new Set<string>();
    this.clubs.forEach(club => {
      club.tags.forEach(tag => tagsSet.add(tag));
    });
    this.availableTags = Array.from(tagsSet);
  }

  isTagSelected(tag: string): boolean {
    return this.filters.selectedTags.has(tag);
  }

  toggleTag(tag: string) {
    if (this.filters.selectedTags.has(tag)) {
      this.filters.selectedTags.delete(tag);
    } else {
      this.filters.selectedTags.add(tag);
    }
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  getSelectedTagsArray(): string[] {
    return Array.from(this.filters.selectedTags);
  }
  */

  onSearchChange() {
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return (
      // this.filters.selectedTags.size > 0 ||
      // !!this.filters.category ||
      !!this.filters.searchText
    );
  }

  private applyFilters() {
    this.filteredClubs = this.clubs.filter(club => {
      const matchesSearch = !this.filters.searchText ||
        club.name.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
        club.description.toLowerCase().includes(this.filters.searchText.toLowerCase());
        // club.tags?.some(tag => tag.toLowerCase().includes(this.filters.searchText.toLowerCase()));

      // const matchesCategory = !this.filters.category || club.category === this.filters.category;

      // const matchesTags = this.filters.selectedTags.size === 0 ||
      //   club.tags?.some(tag => this.filters.selectedTags.has(tag));

      // return matchesSearch && matchesCategory && matchesTags;
      return matchesSearch;
    });
  }

  resetFilters() {
    this.filters = {
      searchText: '',
      // category: '',
      // selectedTags: new Set<string>()
    };
    this.filteredClubs = [...this.clubs];
  }
}
