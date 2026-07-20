const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG and WEBP images are allowed.");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Image must be smaller than 5MB.");
  }
}
