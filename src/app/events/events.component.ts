import { Component, OnInit } from '@angular/core';
import { EventService, EventDTO } from '../event.service'; // Adjust the path if necessary
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  availableCategories: string[] = [];
  availableTags: string[] = [];
  
  events: EventDTO[] = [];
  filteredEvents: EventDTO[] = [];

  filters = {
    searchText: '',
    category: '',
    selectedTags: new Set<string>(),
    date: ''
  };

  // Remove or comment out imageUrl and organizer related code
  /* 
  interface Organizer {
    name: string;
    avatar: string;
  }
  */

  constructor(private eventService: EventService) { }

  // ngOnDestroy() {
  //   // Clean up component state
  //   this.events = [];
  //   this.filteredEvents = [];
  //   this.filters = {
  //     searchText: '',
  //     category: '',
  //     selectedTags: new Set<string>(),
  //     date: ''
  //   };
  // }

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = [...this.events];
        this.extractAvailableCategories();
        this.extractAvailableTags();
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  // Extract unique categories from fetched events
  extractAvailableCategories() {
    const categoriesSet = new Set(this.events.map(event => event.category));
    this.availableCategories = Array.from(categoriesSet);
  }

  // Extract unique tags from fetched events
  extractAvailableTags() {
    const tagsSet = new Set<string>();
    this.events.forEach(event => {
      event.tags.forEach(tag => tagsSet.add(tag));
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

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onDateChange() {
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.filters.selectedTags.size > 0 || 
           !!this.filters.category || 
           !!this.filters.searchText ||
           !!this.filters.date;
  }

  getSelectedTagsArray(): string[] {
    return Array.from(this.filters.selectedTags);
  }

  private applyFilters() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !this.filters.searchText || 
        event.title.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
        event.description.toLowerCase().includes(this.filters.searchText.toLowerCase());

      const matchesCategory = !this.filters.category || event.category === this.filters.category;

      const matchesTags = this.filters.selectedTags.size === 0 || 
        event.tags.some(tag => this.filters.selectedTags.has(tag));

      const matchesDate = !this.filters.date || (new Date(event.date).toISOString().split('T')[0] === this.filters.date);

      return matchesSearch && matchesCategory && matchesTags && matchesDate;
    });
  }

  resetFilters() {
    this.filters = {
      searchText: '',
      category: '',
      selectedTags: new Set<string>(),
      date: ''
    };
    this.filteredEvents = [...this.events];
  }
}



// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// interface Event {
//   name: string;
//   description: string;
//   category: string;
//   tags: string[];
//   imageUrl: string;
//   location: string;
//   date: string;
//   organizer: {
//     name: string;
//     avatar: string;
//   };
// }

// @Component({
//   selector: 'app-events',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './events.component.html',
//   styleUrls: ['./events.component.css']
// })
// export class EventsComponent implements OnInit {
//   availableCategories: string[] = ['Music', 'Art', 'Technology', 'Sports'];
//   availableTags: string[] = ['Free Entry', 'Online', 'In-Person', 'Ticketed'];

//   events: Event[] = [
//     {
//       name: 'Music Festival',
//       description: 'Experience an unforgettable music festival with amazing artists and live performances.',
//       category: 'Music',
//       tags: ['Free Entry', 'In-Person'],
//       imageUrl: 'assets/images/music-festival.jpg',
//       location: 'California',
//       date: '2024-04-15',
//       organizer: {
//         name: 'Music Events Inc',
//         avatar: 'assets/images/organizer1.jpg'
//       }
//     },
//     {
//       name: 'Tech Innovation Summit',
//       description: 'Join industry leaders for cutting-edge tech discussions and networking opportunities.',
//       category: 'Technology',
//       tags: ['Ticketed', 'Online'],
//       imageUrl: 'assets/images/tech-summit.jpg',
//       location: 'Virtual Event',
//       date: '2024-05-20',
//       organizer: {
//         name: 'TechCorp Events',
//         avatar: 'assets/images/organizer2.jpg'
//       }
//     },
//     {
//       name: 'Art Gallery Exhibition',
//       description: 'Discover contemporary artworks from emerging and established artists.',
//       category: 'Art',
//       tags: ['Free Entry', 'In-Person'],
//       imageUrl: 'assets/images/art-gallery.jpg',
//       location: 'New York',
//       date: '2024-04-28',
//       organizer: {
//         name: 'Urban Arts Center',
//         avatar: 'assets/images/organizer3.jpg'
//       }
//     },
//     {
//       name: 'Championship Finals',
//       description: 'Watch the ultimate showdown between top teams in this season finale.',
//       category: 'Sports',
//       tags: ['Ticketed', 'In-Person'],
//       imageUrl: 'assets/images/sports-event.jpg',
//       location: 'Miami',
//       date: '2024-06-10',
//       organizer: {
//         name: 'Sports League Pro',
//         avatar: 'assets/images/organizer4.jpg'
//       }
//     },
//     {
//       name: 'Jazz Night',
//       description: 'An evening of smooth jazz featuring local and international artists.',
//       category: 'Music',
//       tags: ['Ticketed', 'In-Person'],
//       imageUrl: 'assets/images/jazz-night.jpg',
//       location: 'Chicago',
//       date: '2024-05-05',
//       organizer: {
//         name: 'Jazz Club Events',
//         avatar: 'assets/images/organizer5.jpg'
//       }
//     },
//     {
//       name: 'Digital Art Workshop',
//       description: 'Learn digital art techniques from professional artists in this hands-on workshop.',
//       category: 'Art',
//       tags: ['Ticketed', 'Online'],
//       imageUrl: 'assets/images/digital-art.jpg',
//       location: 'Virtual Event',
//       date: '2024-05-15',
//       organizer: {
//         name: 'Creative Arts Academy',
//         avatar: 'assets/images/organizer6.jpg'
//       }
//     },
//     {
//       name: 'Hackathon 2024',
//       description: '48-hour coding challenge to build innovative solutions for real-world problems.',
//       category: 'Technology',
//       tags: ['Free Entry', 'In-Person'],
//       imageUrl: 'assets/images/hackathon.jpg',
//       location: 'San Francisco',
//       date: '2024-07-01',
//       organizer: {
//         name: 'Tech Innovators Hub',
//         avatar: 'assets/images/organizer7.jpg'
//       }
//     },
//     {
//       name: 'Marathon Challenge',
//       description: 'Annual city marathon featuring professional and amateur runners.',
//       category: 'Sports',
//       tags: ['Ticketed', 'In-Person'],
//       imageUrl: 'assets/images/marathon.jpg',
//       location: 'Boston',
//       date: '2024-06-25',
//       organizer: {
//         name: 'City Sports Association',
//         avatar: 'assets/images/organizer8.jpg'
//       }
//     },
//     {
//       name: 'Virtual Reality Expo',
//       description: 'Explore the latest in VR technology and immersive experiences.',
//       category: 'Technology',
//       tags: ['Ticketed', 'In-Person'],
//       imageUrl: 'assets/images/vr-expo.jpg',
//       location: 'Las Vegas',
//       date: '2024-08-10',
//       organizer: {
//         name: 'Future Tech Events',
//         avatar: 'assets/images/organizer9.jpg'
//       }
//     }
//   ];

//   filters = {
//     searchText: '',
//     category: '',
//     selectedTags: new Set<string>(),
//     date: ''
//   };

//   filteredEvents: Event[] = [];

//   ngOnInit() {
//     this.filteredEvents = [...this.events];
//   }

//   isTagSelected(tag: string): boolean {
//     return this.filters.selectedTags.has(tag);
//   }

//   toggleTag(tag: string) {
//     if (this.filters.selectedTags.has(tag)) {
//       this.filters.selectedTags.delete(tag);
//     } else {
//       this.filters.selectedTags.add(tag);
//     }
//     this.applyFilters();
//   }

//   onSearchChange() {
//     this.applyFilters();
//   }

//   onCategoryChange() {
//     this.applyFilters();
//   }

//   onDateChange() {
//     this.applyFilters();
//   }

//   hasActiveFilters(): boolean {
//     return this.filters.selectedTags.size > 0 || 
//            !!this.filters.category || 
//            !!this.filters.searchText ||
//            !!this.filters.date;
//   }

//   getSelectedTagsArray(): string[] {
//     return Array.from(this.filters.selectedTags);
//   }

//   private applyFilters() {
//     this.filteredEvents = this.events.filter(event => {
//       const matchesSearch = !this.filters.searchText || 
//         event.name.toLowerCase().includes(this.filters.searchText.toLowerCase()) ||
//         event.description.toLowerCase().includes(this.filters.searchText.toLowerCase());
      
//       const matchesCategory = !this.filters.category || event.category === this.filters.category;
      
//       const matchesTags = this.filters.selectedTags.size === 0 || 
//         event.tags.some(tag => this.filters.selectedTags.has(tag));
      
//       const matchesDate = !this.filters.date || event.date === this.filters.date;
      
//       return matchesSearch && matchesCategory && matchesTags && matchesDate;
//     });
//   }

//   resetFilters() {
//     this.filters = {
//       searchText: '',
//       category: '',
//       selectedTags: new Set<string>(),
//       date: ''
//     };
//     this.filteredEvents = [...this.events];
//   }
// }