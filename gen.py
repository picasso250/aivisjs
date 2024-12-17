import os
import hashlib
import re
import shutil

from staticversion import HTMLStaticVersionTransformer

site_root_dir = "_site"

# 查找所有 HTML 文件
def find_html_files(directory):
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def copy_to_site_directory(file_path):
    if not os.path.exists(site_root_dir):
        os.makedirs(site_root_dir)
    shutil.copy(file_path, site_root_dir)


# 使用正则表达式处理 HTML 内容，替换 <link> 和 <script> 标签中的 href 或 src
def process_html_file(html_file):
    parser = HTMLStaticVersionTransformer(html_file)
    result_html = parser.get_html()
    static_files = parser.static_files
    return result_html, static_files

# 保存修改后的 HTML 到 _site 目录
def save_to_site_directory(html_content, original_html_file, site_directory):
    if not os.path.exists(site_directory):
        os.makedirs(site_directory)

    file_name = os.path.basename(original_html_file)
    site_file_path = os.path.join(site_directory, file_name)

    with open(site_file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

def main():
    # 设置工作目录和 _site 目录
    current_directory = os.getcwd()
    site_directory = os.path.join(current_directory, site_root_dir)

    # 查找所有 HTML 文件
    html_files = find_html_files(current_directory)

    # 处理每个 HTML 文件
    static_files = set()
    for html_file in html_files:
        print(f"Processing {html_file}...")
        html_content, static_files_in_html = process_html_file(html_file)
        save_to_site_directory(html_content, html_file, site_directory)
        static_files.update(static_files_in_html)

    for static_file in static_files:
        print(f"Copying {static_file}...")
        copy_to_site_directory(static_file)

    print(f"Processed HTML files are saved in {site_directory}.")

if __name__ == "__main__":
    main()
