#!/usr/bin/env python3
"""
Verification Script for Admin Panel Extraction
Checks if extraction was completed successfully
"""

import os
from pathlib import Path

# ANSI color codes
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def check_file_exists(path, description):
    """Check if a file or directory exists"""
    exists = os.path.exists(path)
    status = f"{GREEN}✓{RESET}" if exists else f"{RED}✗{RESET}"
    print(f"{status} {description}: {path}")
    return exists

def check_file_not_exists(path, description):
    """Check if a file or directory DOES NOT exist (should be removed)"""
    exists = os.path.exists(path)
    status = f"{GREEN}✓{RESET}" if not exists else f"{RED}✗{RESET}"
    state = "removed" if not exists else "still exists (should be removed!)"
    print(f"{status} {description} {state}: {path}")
    return not exists

def check_import_path(file_path, old_pattern, description):
    """Check if old import patterns were replaced"""
    if not os.path.exists(file_path):
        print(f"{YELLOW}⚠{RESET} Cannot check {description}: {file_path} not found")
        return None
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        has_old_pattern = old_pattern in content
        status = f"{GREEN}✓{RESET}" if not has_old_pattern else f"{RED}✗{RESET}"
        state = "updated" if not has_old_pattern else "still has old imports!"
        print(f"{status} {description} {state}")
        return not has_old_pattern
    except Exception as e:
        print(f"{YELLOW}⚠{RESET} Error checking {file_path}: {e}")
        return None

def main():
    print("=" * 70)
    print(f"{BLUE}🔍 Admin Panel Extraction Verification{RESET}")
    print("=" * 70)
    print()
    
    results = {
        'passed': 0,
        'failed': 0,
        'warnings': 0
    }
    
    # ========================================================================
    # CHECK 1: Admin Panel Directory Structure
    # ========================================================================
    print(f"{BLUE}📁 Admin Panel Structure{RESET}")
    print("-" * 70)
    
    admin_dirs = [
        ("admin-panel", "Root admin panel directory"),
        ("admin-panel/pages", "Admin pages directory"),
        ("admin-panel/components", "Admin components directory"),
        ("admin-panel/components/ui", "UI components directory"),
        ("admin-panel/contexts", "Contexts directory"),
        ("admin-panel/types", "Types directory"),
        ("admin-panel/data", "Data directory"),
        ("admin-panel/styles", "Styles directory"),
    ]
    
    for path, desc in admin_dirs:
        if check_file_exists(path, desc):
            results['passed'] += 1
        else:
            results['failed'] += 1
    
    print()
    
    # ========================================================================
    # CHECK 2: Admin Panel Core Files
    # ========================================================================
    print(f"{BLUE}📄 Admin Panel Core Files{RESET}")
    print("-" * 70)
    
    admin_files = [
        ("admin-panel/App.tsx", "Admin App entry point"),
        ("admin-panel/routes.tsx", "Admin routes configuration"),
        ("admin-panel/README.md", "Admin README"),
    ]
    
    for path, desc in admin_files:
        if check_file_exists(path, desc):
            results['passed'] += 1
        else:
            results['failed'] += 1
    
    print()
    
    # ========================================================================
    # CHECK 3: Admin Pages (10 files)
    # ========================================================================
    print(f"{BLUE}📋 Admin Pages{RESET}")
    print("-" * 70)
    
    admin_pages = [
        "AdminDashboard.tsx",
        "AdminLogin.tsx",
        "AdminLayout.tsx",
        "Analytics.tsx",
        "ProductsManagement.tsx",
        "OrdersManagement.tsx",
        "BrandsManagement.tsx",
        "CategoriesManagement.tsx",
        "CustomersManagement.tsx",
        "AdminSettings.tsx",
    ]
    
    for page in admin_pages:
        path = f"admin-panel/pages/{page}"
        if check_file_exists(path, f"Page: {page}"):
            results['passed'] += 1
        else:
            results['failed'] += 1
    
    print()
    
    # ========================================================================
    # CHECK 4: UI Components (sample check)
    # ========================================================================
    print(f"{BLUE}🎨 UI Components (Sample Check){RESET}")
    print("-" * 70)
    
    ui_components = [
        "button.tsx",
        "card.tsx",
        "input.tsx",
        "table.tsx",
        "dialog.tsx",
        "select.tsx",
        "badge.tsx",
        "utils.ts",
    ]
    
    for component in ui_components:
        path = f"admin-panel/components/ui/{component}"
        if check_file_exists(path, f"UI: {component}"):
            results['passed'] += 1
        else:
            results['failed'] += 1
    
    print()
    
    # ========================================================================
    # CHECK 5: Contexts
    # ========================================================================
    print(f"{BLUE}🔄 Context Files{RESET}")
    print("-" * 70)
    
    contexts = [
        "ThemeContext.tsx",
        "OrderContext.tsx",
        "CartContext.tsx",
        "CartIconContext.tsx",
    ]
    
    for context in contexts:
        path = f"admin-panel/contexts/{context}"
        if check_file_exists(path, f"Context: {context}"):
            results['passed'] += 1
        else:
            results['failed'] += 1
    
    print()
    
    # ========================================================================
    # CHECK 6: Import Paths Updated
    # ========================================================================
    print(f"{BLUE}🔧 Import Paths Updated{RESET}")
    print("-" * 70)
    
    sample_files = [
        "admin-panel/pages/AdminDashboard.tsx",
        "admin-panel/pages/AdminLayout.tsx",
        "admin-panel/pages/Analytics.tsx",
    ]
    
    old_patterns = [
        "../../components/ui/",
        "../../contexts/",
        "../../components/admin/",
    ]
    
    for file_path in sample_files:
        if os.path.exists(file_path):
            file_name = os.path.basename(file_path)
            has_old = False
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                for pattern in old_patterns:
                    if pattern in content:
                        has_old = True
                        break
                
                if not has_old:
                    print(f"{GREEN}✓{RESET} {file_name} imports updated")
                    results['passed'] += 1
                else:
                    print(f"{RED}✗{RESET} {file_name} still has old imports!")
                    results['failed'] += 1
            except:
                results['warnings'] += 1
        else:
            results['warnings'] += 1
    
    print()
    
    # ========================================================================
    # CHECK 7: Main App Cleaned (Admin Removed)
    # ========================================================================
    print(f"{BLUE}🧹 Main App Cleaned{RESET}")
    print("-" * 70)
    
    removed_paths = [
        ("pages/admin", "Admin pages removed from main app"),
        ("admin", "Admin folder removed"),
        ("components/admin", "Admin components removed"),
    ]
    
    for path, desc in removed_paths:
        if check_file_not_exists(path, desc):
            results['passed'] += 1
        else:
            results['failed'] += 1
    
    print()
    
    # ========================================================================
    # CHECK 8: Main Routes Updated
    # ========================================================================
    print(f"{BLUE}🛣️  Main App Routes{RESET}")
    print("-" * 70)
    
    routes_file = "routes.tsx"
    if os.path.exists(routes_file):
        try:
            with open(routes_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            has_admin_imports = 'from ./pages/admin/' in content or 'from "./pages/admin/' in content
            has_admin_routes = "path: '/admin'" in content or 'path: "/admin"' in content
            
            if not has_admin_imports and not has_admin_routes:
                print(f"{GREEN}✓{RESET} routes.tsx cleaned (no admin routes)")
                results['passed'] += 1
            else:
                print(f"{RED}✗{RESET} routes.tsx still contains admin references!")
                if has_admin_imports:
                    print(f"    {YELLOW}⚠{RESET} Found admin imports")
                if has_admin_routes:
                    print(f"    {YELLOW}⚠{RESET} Found admin routes")
                results['failed'] += 1
        except Exception as e:
            print(f"{YELLOW}⚠{RESET} Error checking routes.tsx: {e}")
            results['warnings'] += 1
    else:
        print(f"{RED}✗{RESET} routes.tsx not found!")
        results['failed'] += 1
    
    print()
    
    # ========================================================================
    # SUMMARY
    # ========================================================================
    print("=" * 70)
    print(f"{BLUE}📊 Verification Summary{RESET}")
    print("=" * 70)
    
    total = results['passed'] + results['failed']
    
    print(f"{GREEN}✓ Passed:{RESET} {results['passed']}")
    print(f"{RED}✗ Failed:{RESET} {results['failed']}")
    if results['warnings'] > 0:
        print(f"{YELLOW}⚠ Warnings:{RESET} {results['warnings']}")
    
    print()
    
    if results['failed'] == 0:
        print(f"{GREEN}🎉 SUCCESS! Admin panel extraction completed successfully!{RESET}")
        print()
        print("Next steps:")
        print("1. Test customer app: npm run dev")
        print("2. Test admin panel: cd admin-panel && npm run dev")
        print("3. Login: admin@harishcloths.com / admin123")
        print("4. Configure separate builds and deploy")
        print()
        print("See /ADMIN_PANEL_EXTRACTION_COMPLETE.md for deployment guide")
    else:
        print(f"{RED}⚠️  ISSUES FOUND! Please fix the failed checks above.{RESET}")
        print()
        print("Common fixes:")
        print("1. Run: python3 extract_admin_panel.py")
        print("2. Or follow: /MANUAL_EXTRACTION_GUIDE.md")
        print("3. Update import paths in admin panel files")
        print("4. Remove admin folders from main app")
        print("5. Update routes.tsx to remove admin routes")
    
    print()
    print("=" * 70)
    
    # Exit with error code if failed
    exit(0 if results['failed'] == 0 else 1)

if __name__ == "__main__":
    main()
