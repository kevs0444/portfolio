import os
import glob
from rembg import remove
from PIL import Image

def process_image(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path, format="PNG")
        print(f"Saved {output_path}")
    except Exception as e:
        print(f"Failed to process {input_path}: {e}")

def main():
    gear_dir = r"d:\Dev\portfolio\public\assets\images\gear"
    # Process all common image types in the gear directory
    for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
        for path in glob.glob(os.path.join(gear_dir, ext)):
            # Skip images that end with '-nobg.png' to avoid loops
            if path.endswith("-nobg.png"):
                continue
            
            base_name = os.path.splitext(os.path.basename(path))[0]
            output_path = os.path.join(gear_dir, f"{base_name}-nobg.png")
            
            # If the original was a png, and we are overwriting, or creating a new file
            process_image(path, output_path)

if __name__ == "__main__":
    main()

