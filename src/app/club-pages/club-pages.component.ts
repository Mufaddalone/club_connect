import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Club {
  name: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-club-pages',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './club-pages.component.html',
  styleUrls: ['./club-pages.component.css']
})
export class ClubPagesComponent implements OnInit {
  availableCategories: string[] = ['Art', 'Technology', 'Sports', 'Music'];
  availableTags: string[] = ['Finance', 'Accounting', 'Entrepreneurship', 'Coding', 'AI', 'Robotics', 
                            'Cricket', 'Football', 'Basketball', 'Live Performances', 'Music Production'];

  clubs: Club[] = [
    {
      name: 'Business Club',
      description: 'A place to explore and showcase your artistic talents.',
      category: 'Business',
      tags: ['Finance', 'Accounting', 'Entrepreneurship'],
      imageUrl: '/assets/images/business.jpeg'
    },
    {
      name: 'Tech Innovators',
      description: 'Join us to learn and create innovative technology solutions.',
      category: 'Technology',
      tags: ['Coding', 'AI', 'Robotics'],
      imageUrl: '/assets/images/tech.jpeg'
    },
    {
      name: 'Sports Club',
      description: 'A place for sports enthusiasts.',
      category: 'Sports',
      tags: ['Cricket', 'Football', 'Basketball'],
      imageUrl: '/assets/images/sports.jpeg'
    },
    {
      name: 'Music Lovers',
      description: 'For those who love making and listening to music.',
      category: 'Music',
      tags: ['Live Performances', 'Music Production'],
      imageUrl: 'assets/images/music.jpeg'
    }
  ];

  filters = {
    searchText: '',
    category: '',
    selectedTags: new Set<string>()
  };

  filteredClubs: Club[] = [];

  ngOnInit() {
    this.filteredClubs = [...this.clubs];
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

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.filters.selectedTags.size > 0 || 
           !!this.filters.category || 
           !!this.filters.searchText;
  }

  getSelectedTagsArray(): string[] {
    return Array.from(this.filters.selectedTags);
  }

  private applyFilters() {
    this.filteredClubs = this.clubs.filter(club => {
      const matchesSearch = !this.filters.searchText || 
        club.name.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
        club.description.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
        club.tags.some(tag => tag.toLowerCase().includes(this.filters.searchText.toLowerCase()));
      
      const matchesCategory = !this.filters.category || club.category === this.filters.category;
      
      const matchesTags = this.filters.selectedTags.size === 0 || 
        club.tags.some(tag => this.filters.selectedTags.has(tag));
      
      return matchesSearch && matchesCategory && matchesTags;
    });
  }

  resetFilters() {
    this.filters = {
      searchText: '',
      category: '',
      selectedTags: new Set<string>()
    };
    this.filteredClubs = [...this.clubs];
  }
}