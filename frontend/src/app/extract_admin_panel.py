#!/usr/bin/env python3
"""
Admin Panel Extraction Script
Extracts the admin panel into a standalone directory with updated import paths
"""

import os
import shutil
import re
from pathlib import Path

# Configuration
ADMIN_PANEL_DIR = "admin-panel"
MAIN_APP_DIR = "."

# Directories to create
DIRECTORIES = [
    f"{ADMIN_PANEL_DIR}/pages",
    f"{ADMIN_PANEL_DIR}/components/ui",
    f"{ADMIN_PANEL_DIR}/contexts",
    f"{ADMIN_PANEL_DIR}/types",
    f"{ADMIN_PANEL_DIR}/data",
    f"{ADMIN_PANEL_DIR}/hooks",
    f"{ADMIN_PANEL_DIR}/styles",
]

# Files to copy
FILES_TO_COPY = {
    # Admin Pages
    "pages/admin/AdminDashboard.tsx": f"{ADMIN_PANEL_DIR}/pages/AdminDashboard.tsx",
    "pages/admin/AdminLogin.tsx": f"{ADMIN_PANEL_DIR}/pages/AdminLogin.tsx",
    "pages/admin/AdminLayout.tsx": f"{ADMIN_PANEL_DIR}/pages/AdminLayout.tsx",
    "pages/admin/Analytics.tsx": f"{ADMIN_PANEL_DIR}/pages/Analytics.tsx",
    "pages/admin/ProductsManagement.tsx": f"{ADMIN_PANEL_DIR}/pages/ProductsManagement.tsx",
    "pages/admin/OrdersManagement.tsx": f"{ADMIN_PANEL_DIR}/pages/OrdersManagement.tsx",
    "pages/admin/BrandsManagement.tsx": f"{ADMIN_PANEL_DIR}/pages/BrandsManagement.tsx",
    "pages/admin/CategoriesManagement.tsx": f"{ADMIN_PANEL_DIR}/pages/CategoriesManagement.tsx",
    "pages/admin/CustomersManagement.tsx": f"{ADMIN_PANEL_DIR}/pages/CustomersManagement.tsx",
    "pages/admin/AdminSettings.tsx": f"{ADMIN_PANEL_DIR}/pages/AdminSettings.tsx",
    
    # Admin Components
    "components/admin/Logo.tsx": f"{ADMIN_PANEL_DIR}/components/Logo.tsx",
    
    # Contexts
    "contexts/ThemeContext.tsx": f"{ADMIN_PANEL_DIR}/contexts/ThemeContext.tsx",
    "contexts/OrderContext.tsx": f"{ADMIN_PANEL_DIR}/contexts/OrderContext.tsx",
    "contexts/CartContext.tsx": f"{ADMIN_PANEL_DIR}/contexts/CartContext.tsx",
    "contexts/CartIconContext.tsx": f"{ADMIN_PANEL_DIR}/contexts/CartIconContext.tsx",
    
    # Types
    "types/product.ts": f"{ADMIN_PANEL_DIR}/types/product.ts",
    
    # Data
    "data/products.ts": f"{ADMIN_PANEL_DIR}/data/products.ts",
    
    # Hooks
    "hooks/useTheme.ts": f"{ADMIN_PANEL_DIR}/hooks/useTheme.ts",
    
    # Styles
    "styles/globals.css": f"{ADMIN_PANEL_DIR}/styles/globals.css",
}

# Import path replacements
IMPORT_REPLACEMENTS = [
    (r"from ['\"]\.\.\/\.\.\/components\/ui\/", "from './components/ui/"),
    (r"from ['\"]\.\.\/\.\.\/components\/admin\/", "from './components/"),
    (r"from ['\"]\.\.\/\.\.\/contexts\/", "from './contexts/"),
    (r"from ['\"]\.\.\/\.\.\/data\/", "from './data/"),
    (r"from ['\"]\.\.\/\.\.\/types\/", "from './types/"),
    (r"from ['\"]\.\.\/\.\.\/hooks\/", "from './hooks/"),
    (r"from ['\"]\.\.\/components\/Logo['\"]", "from './components/Logo'"),
    (r"from ['\"]\.\.\/\.\.\/components\/ui\/utils['\"]", "from './components/ui/utils'"),
]

def create_directories():
    """Create necessary directories for admin panel"""
    print("📁 Creating directory structure...")
    for directory in DIRECTORIES:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"   ✓ {directory}")

def create_admin_config_files():
    """Create necessary config files for admin panel"""
    print("\n⚙️  Creating admin panel config files...")
    
    # Create package.json for admin panel
    package_json = '''{
  "name": "hs-admin-panel",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "H&S Admin Panel - Luxury Fabric Management",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.1.3",
    "lucide-react": "latest",
    "recharts": "^2.15.0",
    "sonner": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.3.5",
    "tailwindcss": "^4.0.0"
  }
}'''
    
    with open(f"{ADMIN_PANEL_DIR}/package.json", 'w', encoding='utf-8') as f:
        f.write(package_json)
    print(f"   ✓ Created package.json")
    
    # Create vite.config.ts for admin panel
    vite_config = '''import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false,
    host: true,
  },
  preview: {
    port: 4174,
  },
});
'''
    
    with open(f"{ADMIN_PANEL_DIR}/vite.config.ts", 'w', encoding='utf-8') as f:
        f.write(vite_config)
    print(f"   ✓ Created vite.config.ts")
    
    # Create index.html for admin panel
    index_html = '''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="H&S Admin Panel - Luxury Fabric Management" />
    <title>H&S Admin Panel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/App.tsx"></script>
  </body>
</html>
'''
    
    with open(f"{ADMIN_PANEL_DIR}/index.html", 'w', encoding='utf-8') as f:
        f.write(index_html)
    print(f"   ✓ Created index.html")
    
    # Create .gitignore for admin panel
    gitignore = '''# Dependencies
node_modules
.pnpm-store

# Build output
dist
dist-admin

# Environment variables
.env
.env.local
.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories
.vscode
.idea
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db
'''
    
    with open(f"{ADMIN_PANEL_DIR}/.gitignore", 'w', encoding='utf-8') as f:
        f.write(gitignore)
    print(f"   ✓ Created .gitignore")

def copy_ui_components():
    """Copy all UI components from shadcn/ui"""
    print("\n🎨 Copying UI component library...")
    ui_source = "components/ui"
    ui_dest = f"{ADMIN_PANEL_DIR}/components/ui"
    
    if os.path.exists(ui_source):
        # Get all files in components/ui
        for file in os.listdir(ui_source):
            source_file = os.path.join(ui_source, file)
            dest_file = os.path.join(ui_dest, file)
            
            if os.path.isfile(source_file):
                shutil.copy2(source_file, dest_file)
                print(f"   ✓ {file}")
    else:
        print(f"   ⚠️  Warning: {ui_source} not found")

def copy_files():
    """Copy specified files to admin panel"""
    print("\n📄 Copying admin files...")
    for source, dest in FILES_TO_COPY.items():
        if os.path.exists(source):
            shutil.copy2(source, dest)
            print(f"   ✓ {source} → {dest}")
        else:
            print(f"   ⚠️  Warning: {source} not found")

def update_import_paths(file_path):
    """Update import paths in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all replacement patterns
        for pattern, replacement in IMPORT_REPLACEMENTS:
            content = re.sub(pattern, replacement, content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"   ⚠️  Error updating {file_path}: {e}")
        return False

def update_all_imports():
    """Update import paths in all admin panel files"""
    print("\n🔧 Updating import paths...")
    
    # Update pages
    pages_dir = f"{ADMIN_PANEL_DIR}/pages"
    if os.path.exists(pages_dir):
        for file in os.listdir(pages_dir):
            if file.endswith('.tsx'):
                file_path = os.path.join(pages_dir, file)
                if update_import_paths(file_path):
                    print(f"   ✓ Updated {file}")
    
    # Update components
    components_dir = f"{ADMIN_PANEL_DIR}/components"
    if os.path.exists(components_dir):
        for file in os.listdir(components_dir):
            if file.endswith('.tsx'):
                file_path = os.path.join(components_dir, file)
                if update_import_paths(file_path):
                    print(f"   ✓ Updated {file}")
    
    # Update contexts
    contexts_dir = f"{ADMIN_PANEL_DIR}/contexts"
    if os.path.exists(contexts_dir):
        for file in os.listdir(contexts_dir):
            if file.endswith('.tsx') or file.endswith('.ts'):
                file_path = os.path.join(contexts_dir, file)
                if update_import_paths(file_path):
                    print(f"   ✓ Updated {file}")

def remove_admin_from_main_app():
    """Remove admin files from main app"""
    print("\n🧹 Removing admin files from main app...")
    
    paths_to_remove = [
        "pages/admin",
        "admin",
        "components/admin",
    ]
    
    for path in paths_to_remove:
        if os.path.exists(path):
            if os.path.isdir(path):
                shutil.rmtree(path)
                print(f"   ✓ Removed directory: {path}")
            else:
                os.remove(path)
                print(f"   ✓ Removed file: {path}")
        else:
            print(f"   ⏭️  Skipped (not found): {path}")

def update_main_routes():
    """Update main app routes to remove admin routes"""
    print("\n🛣️  Updating main app routes...")
    routes_file = "routes.tsx"
    
    if not os.path.exists(routes_file):
        print(f"   ⚠️  {routes_file} not found")
        return
    
    try:
        with open(routes_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove admin imports
        content = re.sub(r"import.*from.*\/admin\/.*\n", "", content)
        content = re.sub(r"import.*Admin.*from.*\n", "", content)
        
        # Remove admin routes block
        # This is a simplified pattern - might need manual adjustment
        content = re.sub(
            r"  // Admin Routes\n.*?path: '\/admin'.*?children:.*?\],\n  \},",
            "",
            content,
            flags=re.DOTALL
        )
        
        # Also remove the standalone admin login route
        content = re.sub(
            r"  \{\n    path: '\/admin\/login',\n    element: <AdminLogin \/>,\n  \},\n",
            "",
            content
        )
        
        with open(routes_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"   ✓ Updated {routes_file}")
        print(f"   ⚠️  Please review {routes_file} manually to ensure correctness")
    except Exception as e:
        print(f"   ⚠️  Error updating {routes_file}: {e}")
        print(f"   ⚠️  Please update {routes_file} manually")

def main():
    """Main execution function"""
    print("=" * 60)
    print("🚀 Admin Panel Extraction Script")
    print("=" * 60)
    print()
    
    # Execute steps
    create_directories()
    create_admin_config_files()
    copy_ui_components()
    copy_files()
    update_all_imports()
    remove_admin_from_main_app()
    update_main_routes()
    
    print()
    print("=" * 60)
    print("✅ Admin Panel Extraction Complete!")
    print("=" * 60)
    print()
    print("📦 Admin Panel Location: /admin-panel")
    print("📦 Main App: / (admin files removed)")
    print()
    print("🎯 Next Steps:")
    print("1. Review /routes.tsx for any remaining admin references")
    print("2. Test admin panel: cd admin-panel && npm run dev")
    print("3. Configure separate build processes (see guide)")
    print("4. Deploy to different domains")
    print()
    print("📚 See /ADMIN_PANEL_EXTRACTION_COMPLETE.md for full guide")
    print()

if __name__ == "__main__":
    main()