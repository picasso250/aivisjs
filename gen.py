import os
import hashlib
import re
import shutil
site_root_dir = "_site"

# 查找所有 HTML 文件
def find_html_files(directory):
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

# 计算文件的 MD5 值
def get_file_md5(file_path):
    hasher = hashlib.md5()
    try:
        with open(file_path, 'rb') as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    return hasher.hexdigest()

def copy_to_site_directory(file_path):
    if not os.path.exists(site_root_dir):
        os.makedirs(site_root_dir)
    shutil.copy(file_path, site_root_dir)

# 给 URL 加上版本号（MD5 值）
def append_version_to_url(url, version):
    if '?' in url:
        return f"{url}&v={version}"
    else:
        return f"{url}?v={version}"

# 使用正则表达式处理 HTML 内容，替换 <link> 和 <script> 标签中的 href 或 src
def process_html_file(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # 匹配 <link> 标签的 href 属性
    def replace_link_tag(match):
        file_url = match.group(1)
        file_path = os.path.join(os.path.dirname(html_file), file_url)

        if os.path.exists(file_path):
            copy_to_site_directory(file_path)
            md5_hash = get_file_md5(file_path)
            versioned_url = append_version_to_url(file_url, md5_hash)
            return f'<link href="{versioned_url}">'  # 替换 href
        return match.group(0)

    # 匹配 <script> 标签的 src 属性
    def replace_script_tag(match):
        file_url = match.group(1)
        file_path = os.path.join(os.path.dirname(html_file), file_url)

        if os.path.exists(file_path):
            copy_to_site_directory(file_path)
            md5_hash = get_file_md5(file_path)
            versioned_url = append_version_to_url(file_url, md5_hash)
            return f'<script src="{versioned_url}">'  # 替换 src
        return match.group(0)

    # 正则匹配 <link> 标签的 href 属性
    html_content = re.sub(r'<link [^>]*href="([^"]+)"[^>]*>', replace_link_tag, html_content)

    # 正则匹配 <script> 标签的 src 属性
    html_content = re.sub(r'<script [^>]*src="([^"]+)"[^>]*>', replace_script_tag, html_content)

    return html_content

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
    for html_file in html_files:
        print(f"Processing {html_file}...")
        html_content = process_html_file(html_file)
        save_to_site_directory(html_content, html_file, site_directory)

    print(f"Processed HTML files are saved in {site_directory}.")

if __name__ == "__main__":
    main()
