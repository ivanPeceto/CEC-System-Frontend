import { ModalType } from "../../types/modal";

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: ModalType;
}