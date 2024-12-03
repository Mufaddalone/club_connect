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
  clubs: Club[] = [];
  filteredClubs: Club[] = [];
  subscribedClubs = new Set<number>();

  // Modal state
  showCreateClubModal = false;
  showEventModal = false;

  // Form model for the new club
  newClub = {
    clubId: 0,
    name: '',
    description: '',
    imageUrl: '',
    eventIds: []
  };

  newEvent = {
    eventId: 0,
    name: '',
    description: '',
    tags:'',
    attendeesIds: [],
    clubId: 0
  };

  availableClubs: { id: number; name: string; }[] = [];

  constructor(private clubService: ClubService) {}

  ngOnInit() {
    this.clubService.getClubs().subscribe(clubs => {
      this.clubs = clubs;
      this.filteredClubs = [...this.clubs];
      console.log("HAHAHAHAHAH",this.clubs);
    });
  }

  // Open the modal
  openCreateClubModal() {
    this.showCreateClubModal = true;
  }

  openCreateEventModal() {
    this.showEventModal = true;
  }

  // Close the modal and reset form
  closeCreateClubModal() {
    this.showCreateClubModal = false;
    this.resetForm();
  }

  closeCreateEventModal() {
    this.showEventModal = false;
  }

  generateRandomEventId(): number {
    return Math.floor(Math.random() * 1000000); // Random ID between 0 and 999999
  }
  // Generate a random clubId
  generateRandomClubId(): number {
    return Math.floor(Math.random() * 1000000); // Random ID between 0 and 999999
  }

  // Handle Create Club form submission
  onSubmitCreateClub() {
    this.newClub.clubId = this.generateRandomClubId(); // Assign a random clubId
    this.clubService.createClub(this.newClub).subscribe({
      next: () => {
        console.log('Club created successfully');
        this.closeCreateClubModal(); // Close modal
      },
      error: (error) => {
        console.error('Failed to create club:', error);
      }
    });
  }

  onSubmitCreateEvent() {

    const tagsArray = this.newEvent.tags 
    ? this.newEvent.tags.split(',').map(tag => tag.trim()) 
    : [];

    // Construct the newEvent object with required fields
    const formattedEvent = {
      name: this.newEvent.name, // Use values from your form
      description: this.newEvent.description,
      attendeeIds: [], // Initialize with an empty array
      clubId: +this.newEvent.clubId, // Selected club ID from the dropdown
      tags: tagsArray, // Tags can be added if available, or default to an empty array
      eventId: this.generateRandomEventId(), // Generate a unique event ID
    };
  
    console.log('Submitting event:', formattedEvent); // Debug log
  
    // Send the formatted event to the service
    this.clubService.createEvent(formattedEvent).subscribe({
      next: () => {
        console.log('Event created successfully');
        this.closeCreateEventModal();
      },
      error: (error) => {
        console.error('Failed to create event:', error); // Log the error
      }
    });
  }
  
  // Reset the form
  resetForm() {
    this.newClub = {
      clubId: 0,
      name: '',
      description: '',
      imageUrl: '',
      eventIds: []
    };
  }

  fetchAvailableClubs() {
    this.clubService.getClubs().subscribe({
      next: (clubResponse) => {
        // Map clubs into availableClubs array
        this.availableClubs = (clubResponse || []).map((club: any) => ({
          id: club.id,
          name: club.name,
        }));
  
        console.log('Available Clubs:', this.availableClubs);
      },
      error: (err) => console.error('Failed to fetch clubs:', err),
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!this.filters.searchText;
  }

  private applyFilters() {
    this.filteredClubs = this.clubs.filter(club => {
      const matchesSearch = !this.filters.searchText ||
        club.name.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
        club.description.toLowerCase().includes(this.filters.searchText.toLowerCase());
      return matchesSearch;
    });
  }

  resetFilters() {
    this.filters = { searchText: '' };
    this.filteredClubs = [...this.clubs];
  }

  filters = {
    searchText: ''
  };
}