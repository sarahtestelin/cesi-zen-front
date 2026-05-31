import { Component, signal } from '@angular/core';

type CookieChoice = 'accepted' | 'refused';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.css',
})
export class CookieBanner {
  private readonly storageKey = 'cesizen-cookie-choice';

  protected readonly isVisible = signal(!this.hasStoredChoice());

  protected acceptCookies(): void {
    this.saveChoice('accepted');
  }

  protected refuseCookies(): void {
    this.saveChoice('refused');
  }

  private saveChoice(choice: CookieChoice): void {
    try {
      localStorage.setItem(this.storageKey, choice);
    } catch {
    }

    this.isVisible.set(false);
  }

  private hasStoredChoice(): boolean {
    try {
      return localStorage.getItem(this.storageKey) !== null;
    } catch {
      return false;
    }
  }
}
