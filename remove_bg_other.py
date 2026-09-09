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
    dirs_to_process = [
        r"d:\Dev\portfolio\public\assets\images",
        r"d:\Dev\portfolio\public\assets\images\projects"
    ]
    
    for d in dirs_to_process:
        for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
            for path in glob.glob(os.path.join(d, ext)):
                # Skip already processed
                if path.endswith("-nobg.png"):
                    continue
                # Skip kevs-ai-character.png etc to save time if we can
                
                base_name = os.path.splitext(os.path.basename(path))[0]
                output_path = os.path.join(d, f"{base_name}-nobg.png")
                process_image(path, output_path)

if __name__ == "__main__":
    main()

