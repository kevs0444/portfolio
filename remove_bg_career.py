import os
from rembg import remove
from PIL import Image

def process_image(input_path, output_path):
    print(f"Processing {input_path}...", flush=True)
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path, format="PNG")
        print(f"Saved {output_path}", flush=True)
    except Exception as e:
        print(f"Failed to process {input_path}: {e}", flush=True)

def main():
    files = [
        r"d:\Dev\portfolio\public\assets\images\career\denso-analytics.png",
        r"d:\Dev\portfolio\public\assets\images\career\phoenix-forecasting.png",
        r"d:\Dev\portfolio\public\assets\images\career\luxasia-internship.jpg",
        r"d:\Dev\portfolio\public\assets\images\career\luxasia-commerce.png",
        r"d:\Dev\portfolio\public\assets\images\career\full-time-job-icon-3d.png"
    ]
    
    for path in files:
        base_name = os.path.splitext(os.path.basename(path))[0]
        output_path = os.path.join(os.path.dirname(path), f"{base_name}-nobg.png")
        if not os.path.exists(output_path):
            process_image(path, output_path)

if __name__ == "__main__":
    main()

