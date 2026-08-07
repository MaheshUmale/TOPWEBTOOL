import os

# Define the root folder of your website
# Change '.' to your actual website folder path if this script is not inside it
website_folder = '.' 
output_file = 'my_entire_website_code.txt'

with open(output_file, 'w', encoding='utf-8') as outfile:
    # Walk through all directories and files
    for root, dirs, files in os.walk(website_folder):
        for file in files:
            # Only target HTML, CSS, and JS files
            if file.endswith(('.html', '.css', '.js')):
                file_path = os.path.join(root, file)
                
                # Write a clear structural header for the AI
                outfile.write(f"\n\n=========================================\n")
                outfile.write(f"FILEPATH: {file_path}\n")
                outfile.write(f"=========================================\n\n")
                
                # Read and append the code content
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                        outfile.write(infile.read())
                except Exception as e:
                    outfile.write(f"[Error reading file: {str(e)}]\n")

print(f"Success! All code combined into '{output_file}'. Upload this to AI Studio.")
