import { Component, Input } from '@angular/core';
import { NavItemConfig } from '../../interfaces/ui-config/nav-item-config.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  navItems: NavItemConfig[] = [
    {
      name: 'Movies',
      path: 'movies',
      active: false,
    },
    {
      name: 'TV Shows',
      path: 'tvshows',
      active: false,
    },
  ];

  constructor(private router: Router) {}

  homePage() {
    this.router.navigateByUrl('');
  }

  trackByName(index: number, item: NavItemConfig): string {
    return item.name;
  }

  selectedItem(nav: NavItemConfig) {
    this.navItems.forEach((item) => (item.active = false));
    nav.active = true;
    this.router.navigateByUrl(nav.path);
  }
}
