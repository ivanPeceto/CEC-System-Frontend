import { Injectable, signal } from '@angular/core';
import { ModalState } from '../../../interfaces/global-modal/modal-state';
import { ModalType } from '../../../types/modal';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  readonly state = signal<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: ModalType.ALERT,
  });

  private resolvePromise: ((value: boolean) => void) | null = null;

  showError(title: string, message: string): void {
    this.state.set({ isOpen: true, title, message, type: ModalType.ERROR });
  }

  showAlert(title: string, message: string): void {
    this.state.set({ isOpen: true, title, message, type: ModalType.ALERT });
  }

  showSuccess(title: string, message: string): void {
    this.state.set({ isOpen: true, title, message, type: ModalType.SUCCESS });
  }

  showConfirm(title: string, message: string): Promise<boolean> {
    this.state.set({ isOpen: true, title, message, type: ModalType.CONFIRM });

    return new Promise<boolean>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  closeModal(result: boolean = false): void {
    this.state.update(current => ({ ...current, isOpen: false }));
    if (this.resolvePromise) {
      this.resolvePromise(result);
      this.resolvePromise = null;
    }
  }
}
