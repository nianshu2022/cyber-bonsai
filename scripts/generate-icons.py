from PIL import Image, ImageDraw
import os

def create_icon(size, output_path):
    img = Image.new('RGBA', (size, size), (10, 10, 10, 255))
    draw = ImageDraw.Draw(img)
    
    # 计算缩放比例
    scale = size / 192
    
    # 绘制盆栽
    # 花盆
    pot_x = int(80 * scale)
    pot_y = int(140 * scale)
    pot_w = int(32 * scale)
    pot_h = int(16 * scale)
    draw.rectangle([pot_x, pot_y, pot_x + pot_w, pot_y + pot_h], fill=(139, 69, 19, 255))
    
    # 茎
    stem_x = int(96 * scale)
    stem_y = int(120 * scale)
    stem_w = int(16 * scale)
    stem_h = int(32 * scale)
    draw.rectangle([stem_x, stem_y, stem_x + stem_w, stem_y + stem_h], fill=(139, 69, 19, 255))
    
    # 叶子
    leaf_positions = [
        (88, 104, 16, 24, (34, 197, 94, 255)),
        (96, 96, 16, 16, (34, 197, 94, 255)),
        (80, 112, 16, 16, (22, 163, 74, 255)),
        (104, 112, 16, 16, (22, 163, 74, 255)),
    ]
    
    for lx, ly, lw, lh, color in leaf_positions:
        x1 = int(lx * scale)
        y1 = int(ly * scale)
        x2 = int((lx + lw) * scale)
        y2 = int((ly + lh) * scale)
        draw.rectangle([x1, y1, x2, y2], fill=color)
    
    img.save(output_path, 'PNG')
    print(f"Generated: {output_path}")

# 生成不同尺寸的图标
icons_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(icons_dir, exist_ok=True)

create_icon(192, os.path.join(icons_dir, 'icon-192.png'))
create_icon(512, os.path.join(icons_dir, 'icon-512.png'))

print("Icons generated successfully!")
