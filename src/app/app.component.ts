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
    const i = this.elements.findIndex(it => it === element);
    if (i >= 0) {
      this.elements.splice(i, 1);
      this.scoreMatrix.splice(i, 1);
      for (let row of this.scoreMatrix) {
        if (row) row.splice(i, 1);
      }
    }
  }

  setElementsToOneToFive() {
    const result = [];
    for (let i = 1; i <= 5; i++) {
      result.push(`${i}`);
      this.elements = result;
    }
  }

  setElementsToOneTo25Horses() {
    const result = [];
    for (let i = 1; i <= 25; i++) {
      result.push(`Horse ${("0" + i).slice(-2)}`);
      this.elements = result;
    }
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

  setScoreForField(first: number, count: number) {
    this.scoredElements = this.elements.slice(first, first + count).sort();
  }

  setScoreForEachNth(interval: number) {
    const result = [];
    for (let i = 0; i < this.elements.length; i += interval) {
      result.push(this.elements[i]);
    }
    this.scoredElements = result.sort();
  }

  scoreMatrix: Score[][] = [];

  getScore(row: number, column: number): Score {
    if (this.scoreMatrix[row] === undefined) return undefined;
    return this.scoreMatrix[row][column];
  }

  worseThan(element: string): number {
    return this.scoreMatrix[this.elements?.indexOf(element)]?.reduce((a: number, v: Score) => { return v === '<' ? a + 1 : a }, 0) ?? 0
  }

  betterThan(element: string): number {
    return this.scoreMatrix[this.elements?.indexOf(element)]?.reduce((a: number, v: Score) => { return v === '>' ? a + 1 : a }, 0) ?? 0
  }

  clearScoreMatrix() {
    this.scoreMatrix = [];
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

  swap(i: number, j: number) {
    const a = this.elements[i];
    this.elements[i] = this.elements[j];
    this.elements[j] = a;

    const b = this.scoreMatrix[i];
    this.scoreMatrix[i] = this.scoreMatrix[j];
    this.scoreMatrix[j] = b;

    for (let row of this.scoreMatrix) {
      if (row) {
        const c = row[i];
        row[i] = row[j];
        row[j] = c;
      }
    }
  }

  shuffle() {
    for (var i = 0; i < this.elements.length; i++) {
      const j = Math.floor(Math.random() * (this.elements.length - 1));
      const jj = j < i ? j : j + 1;
      this.swap(i, jj);
    }
  }

  normalize() {
    for (var i = 0; i < this.elements.length - 1; i++) {
      for (var j = i + 1; j < this.elements.length; j++) {
        if (this.scoreMatrix[i] && this.scoreMatrix[i][j] && this.scoreMatrix[i][j] === '<') {
          this.swap(i, j);
        }
      }
    }
  }

  sortByIndetermination() {
    for (var i = 0; i < this.elements.length - 1; i++) {
      const ii = this.betterThan(this.elements[i]) + this.worseThan(this.elements[i]);
      for (var j = i + 1; j < this.elements.length; j++) {
        const jj = this.betterThan(this.elements[j]) + this.worseThan(this.elements[j]);
        if (ii > jj) {
          this.swap(i, j);
        }
      }
    }
  }

  sortByPotentialLeaders() {
    for (var i = 0; i < this.elements.length - 1; i++) {
      const i0 = this.betterThan(this.elements[i]);
      const i1 = this.worseThan(this.elements[i]);
      for (var j = this.elements.length - 1; j > i; j--) {
        const j0 = this.betterThan(this.elements[j]);
        const j1 = this.worseThan(this.elements[j]);
        if (j0 + j1 === this.elements.length - 1 || (i0 + i1 < this.elements.length - 1 && (i1 < j1 || (i1 === j1 && i0 <= j0)))) { } else {
          this.swap(i, j);
        }
      }
    }
  }

  updateTransitives() {
    for (var i = 0; i < this.elements.length; i++) {
      if (this.scoreMatrix[i]) for (var j = 0; j < this.elements.length; j++) {
        if (this.scoreMatrix[i][j]) {
          if (this.scoreMatrix[i][j] === '<') {
            for (var jj = 0; jj < this.elements.length; jj++) {
              if (this.scoreMatrix[j][jj] === '<') this.scoreMatrix[i][jj] = '<';
            }
          } else if (this.scoreMatrix[i][j] === '>') {
            for (var jj = 0; jj < this.elements.length; jj++) {
              if (this.scoreMatrix[j][jj] === '>') this.scoreMatrix[i][jj] = '>';
            }
          }
        }
      }
    }
  }

}

type Score = undefined | '>' | '<';
