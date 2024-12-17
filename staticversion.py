import os
import hashlib
from html.parser import HTMLParser

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

# 给 URL 加上版本号（MD5 值）
def append_version_to_url(url, version):
    if '?' in url:
        return f"{url}&v={version}"
    else:
        return f"{url}?v={version}"

def handle_link(self, tag, attrs_list):
    attrs = dict(attrs_list)
    if 'href' not in attrs:
        return tag, attrs
    href = attrs['href']
    if href.startswith('http'):
        return tag, attrs.items()
    else:
        file_path = os.path.join(os.path.dirname(self.html_file), href)
        if os.path.exists(file_path):
            attrs['href'] = append_version_to_url(href, get_file_md5(file_path))
            self.static_files.append(file_path)
            return tag, attrs.items()
        else:
            return tag, attrs.items()

def handle_script(self, tag, attrs_list):
    attrs = dict(attrs_list)
    if 'src' not in attrs:
        return tag, attrs
    src = attrs['src']
    if src.startswith('http'):
        return tag, attrs.items()
    else:
        file_path = os.path.join(os.path.dirname(self.html_file), src)
        if os.path.exists(file_path):
            attrs['src'] = append_version_to_url(src, get_file_md5(file_path))
            self.static_files.append(file_path)
            return tag, attrs.items()
        else:
            return tag, attrs.items()

callback_dict = {
    "link": handle_link,
    "script": handle_script,
}

class HTMLStaticVersionTransformer(HTMLParser):
    def __init__(self, html_file):
        super().__init__()
        self.html_content = ""
        self.html_file = html_file
        self.static_files = []

    def handle_starttag(self, tag, attrs):
        if tag in callback_dict:
            tag, attrs = callback_dict[tag](self, tag, attrs)
        attrs_str = " ".join([f'{attr[0]}="{attr[1]}"' for attr in attrs])
        if attrs_str:
            self.html_content += f"<{tag} {attrs_str}>"
        else:
            self.html_content += f"<{tag}>"

    def handle_endtag(self, tag):
        self.html_content += f"</{tag}>"

    def handle_startendtag(self, tag, attrs):
        if tag in callback_dict:
            tag, attrs = callback_dict[tag](self, tag, attrs)
        attrs_str = " ".join([f'{attr[0]}="{attr[1]}"' for attr in attrs])
        if attrs_str:
            self.html_content += f"<{tag} {attrs_str} />"
        else:
            self.html_content += f"<{tag} />"

    def handle_data(self, data):
        self.html_content += data

    def get_html(self):
        with open(self.html_file, 'r', encoding='utf-8') as file:
            html_content = file.read()
        self.feed(html_content)
        return self.html_content

if __name__ == "__main__":
    html_file = "softmax.html"
    parser = HTMLStaticVersionTransformer(html_file)
    result_html = parser.get_html()
    print(result_html)
    print(parser.static_files)
