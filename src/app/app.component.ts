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

  removeScoredElement(element: string) {
    this.scoredElements = this.scoredElements.filter(it => it !== element);
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

  scoreMatrix: Score[][] = [];

  getScore(row: number, column: number): Score {
    if (this.scoreMatrix[row] === undefined) return undefined;
    return this.scoreMatrix[row][column];
  }

  applyNewScore() {
    for (var i = 0; i < this.scoredElements.length - 1; i++) {
      const ii = this.elements.findIndex(it => it == this.scoredElements[i]);
      for (var j = i + 1; j < this.scoredElements.length; j++) {
        const jj = this.elements.findIndex(it => it == this.scoredElements[j]);
        if (this.scoreMatrix[ii] === undefined) this.scoreMatrix[ii] = [];
        this.scoreMatrix[ii][jj] = '>';
        if (this.scoreMatrix[jj] === undefined) this.scoreMatrix[jj] = [];
        this.scoreMatrix[jj][ii] = '<';
      }
    }
    this.scoredElements = [];
  }
}

type Score = undefined | '>' | '<';
