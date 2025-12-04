// file-dropzone.component.ts
import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  input,
  output,
  viewChild,
} from '@angular/core';

export type FileValidationErrorReason = 'too_big' | 'invalid_type' | 'too_many';

export interface FileValidationError {
  file: File;
  reason: FileValidationErrorReason;
  message: string;
}

export interface FileSelectionEvent {
  accepted: File[];
  rejected: FileValidationError[];
}

@Component({
  selector: 'lib-file-dropzone',
  template: `
    <label>
      <input
        #fileInput
        type="file"
        [attr.multiple]="multiple() ? '' : null"
        [attr.accept]="acceptAttr"
        (change)="onFileInputChange($event)"
        hidden
      />
      <ng-content></ng-content>
    </label>
  `,
  host: {
    class: 'flex',
  },
})
export class FileDropzoneComponent {
  readonly multiple = input<boolean>(true);
  readonly maxSizeBytes = input<number | null>(null);
  readonly maxFiles = input<number | null>(null);
  readonly acceptedTypes = input<string[] | null>(null);

  readonly filesSelected = output<FileSelectionEvent>();

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  @HostBinding('class.is-drag-over')
  isDragOver = false;

  get acceptAttr(): string | null {
    const types = this.acceptedTypes();
    if (!types || types.length === 0) return null;
    return types.join(',');
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (!files?.length) return;

    this.handleFiles(files);
  }

  onFileInputChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (!inputEl.files?.length) return;

    this.handleFiles(inputEl.files);

    inputEl.value = '';
  }

  private handleFiles(fileList: FileList): void {
    const all = Array.from(fileList);
    const maxFiles = this.maxFiles();

    const initialAccepted: File[] = [];
    const rejected: FileValidationError[] = [];

    if (maxFiles != null && all.length > maxFiles) {
      initialAccepted.push(...all.slice(0, maxFiles));
      const overflow = all.slice(maxFiles);
      for (const file of overflow) {
        rejected.push({
          file,
          reason: 'too_many',
          message: `Too many files (max: ${maxFiles})`,
        });
      }
    } else {
      initialAccepted.push(...all);
    }

    const finalAccepted: File[] = [];
    const acceptedTypes = this.acceptedTypes();
    const maxSize = this.maxSizeBytes();

    for (const file of initialAccepted) {
      const fileErrors: FileValidationError[] = [];

      if (acceptedTypes && acceptedTypes.length > 0) {
        if (!this.isTypeAllowed(file, acceptedTypes)) {
          fileErrors.push({
            file,
            reason: 'invalid_type',
            message: `Invalid file type: ${file.type || file.name}`,
          });
        }
      }

      if (maxSize != null && file.size > maxSize) {
        fileErrors.push({
          file,
          reason: 'too_big',
          message: `File is too large (${file.size} bytes, max ${maxSize})`,
        });
      }

      if (fileErrors.length > 0) {
        rejected.push(...fileErrors);
      } else {
        finalAccepted.push(file);
      }
    }

    this.filesSelected.emit({
      accepted: finalAccepted,
      rejected,
    });
  }

  private isTypeAllowed(file: File, allowedPatterns: string[]): boolean {
    const fileType = (file.type || '').toLowerCase();
    const fileExt = file.name.includes('.')
      ? '.' + file.name.split('.').pop()!.toLowerCase()
      : '';

    return allowedPatterns.some((raw) => {
      const pattern = raw.trim().toLowerCase();
      if (!pattern) return false;

      // Extension: ".png"
      if (pattern.startsWith('.')) {
        return fileExt === pattern;
      }

      // Wildcard mime: "image/*"
      if (pattern.endsWith('/*')) {
        const base = pattern.slice(0, -2);
        return fileType.startsWith(base + '/');
      }

      // Exact mime: "image/png"
      return fileType === pattern;
    });
  }
}
