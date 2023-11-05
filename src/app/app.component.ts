import { Component, ElementRef, ViewChild } from '@angular/core';

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

  setElementsToOneToFive() {
    this.elements = ['One', 'Two', 'Three', 'Four', 'Five'];
  }

  scoredElements: string[] = []

  getUnscoredElements(): string[] {
    return this.elements.filter(it => !this.scoredElements.includes(it));
  }

  private newScoredSelect?: ElementRef;

  @ViewChild('newScoredSelect') set newScoredSelectContent(content: ElementRef) {
    if (content) {
      console.log(content);
      this.newScoredSelect = content;
    }
  }

  newScoredSelectChanged() {
    if (this.newScoredSelect?.nativeElement && 'value' in this.newScoredSelect.nativeElement) {
      this.scoredElements.push(`${this.newScoredSelect.nativeElement.value}`);
      if (this.newScoredSelect?.nativeElement && 'selectedIndex' in this.newScoredSelect.nativeElement) {
        this.newScoredSelect.nativeElement.selectedIndex = 0;
      }
    }
  }
}
