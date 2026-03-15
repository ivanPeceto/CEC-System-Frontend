import { Component, inject } from '@angular/core';
import { UiService } from '../services/ui.service';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-global-modal',
  imports: [LucideAngularModule],
  templateUrl: './global-modal.html',
  styleUrl: './global-modal.css',
})
export class GlobalModal {
  ui = inject(UiService);
}
