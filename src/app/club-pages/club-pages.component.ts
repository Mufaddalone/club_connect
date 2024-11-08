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
  clubs: Club[] = [
    {
      name: 'Art Club',
      description: 'A place to explore and showcase your artistic talents.',
      category: 'Art',
      tags: ['Painting', 'Sculpture', 'Photography'],
      imageUrl: 'https://via.placeholder.com/600x400'
    },
    {
      name: 'Tech Innovators',
      description: 'Join us to learn and create innovative technology solutions.',
      category: 'Technology',
      tags: ['Coding', 'AI', 'Robotics'],
      imageUrl: 'https://via.placeholder.com/600x400'
    },
    {
      name: 'Music Lovers',
      description: 'For those who love making and listening to music.',
      category: 'Music',
      tags: ['Live Performances', 'Music Production'],
      imageUrl: 'https://via.placeholder.com/600x400'
    }
  ];

  filters = {
    searchText: '',
    category: ''
  };

  filteredClubs: Club[] = [];

  ngOnInit() {
    this.filteredClubs = [...this.clubs];
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredClubs = this.clubs.filter(club => {
      const matchesSearch = !this.filters.searchText || 
        club.name.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
        club.description.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
        club.tags.some(tag => tag.toLowerCase().includes(this.filters.searchText.toLowerCase()));
      
      const matchesCategory = !this.filters.category || club.category === this.filters.category;
      
      return matchesSearch && matchesCategory;
    });
  }

  resetFilters() {
    this.filters = { searchText: '', category: '' };
    this.filteredClubs = [...this.clubs];
  }
}