import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  newElement?: string

  onNewElementKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.newElement) {
      this.addElement(this.newElement);
      this.newElement = undefined;
    }
  }

  elements: string[] = []

  addElement(element: string) {
    if (!this.elements.includes(element)) {
      this.elements.push(element);
    }
  }

  removeElement(element: string) {
    this.elements = this.elements.filter(it => it !== element);
  }

  scoreElements: string[] = []

  getScoreElement(index: number): string {
    return this.scoreElements[index] ?? '';
  }

  setScoreElement(index: number, value: string) {
    this.scoreElements[index] = value
  }
}
