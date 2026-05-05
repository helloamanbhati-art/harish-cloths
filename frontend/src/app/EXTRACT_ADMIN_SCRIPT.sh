#!/bin/bash

# ============================================================================
# Admin Panel Extraction Script
# This script extracts the admin panel into a standalone directory
# ============================================================================

echo "🚀 Starting Admin Panel Extraction..."
echo "========================================"

# Create admin-panel directory structure
echo "📁 Creating directory structure..."
mkdir -p admin-panel/{pages,components/{ui},contexts,types,data,hooks,styles}

# ============================================================================
# STEP 1: Copy Admin Pages
# ============================================================================
echo "📄 Copying admin pages..."
cp pages/admin/AdminDashboard.tsx admin-panel/pages/
cp pages/admin/AdminLogin.tsx admin-panel/pages/
cp pages/admin/AdminLayout.tsx admin-panel/pages/
cp pages/admin/Analytics.tsx admin-panel/pages/
cp pages/admin/ProductsManagement.tsx admin-panel/pages/
cp pages/admin/OrdersManagement.tsx admin-panel/pages/
cp pages/admin/BrandsManagement.tsx admin-panel/pages/
cp pages/admin/CategoriesManagement.tsx admin-panel/pages/
cp pages/admin/CustomersManagement.tsx admin-panel/pages/
cp pages/admin/AdminSettings.tsx admin-panel/pages/

# ============================================================================
# STEP 2: Copy Admin Components
# ============================================================================
echo "🧩 Copying admin components..."
cp components/admin/Logo.tsx admin-panel/components/
cp admin/components/Logo.tsx admin-panel/components/Logo2.tsx 2>/dev/null || true

# ============================================================================
# STEP 3: Copy All UI Components (shadcn/ui)
# ============================================================================
echo "🎨 Copying UI component library..."
cp -r components/ui/* admin-panel/components/ui/

# ============================================================================
# STEP 4: Copy Contexts
# ============================================================================
echo "🔄 Copying context providers..."
cp contexts/ThemeContext.tsx admin-panel/contexts/
cp contexts/OrderContext.tsx admin-panel/contexts/
cp contexts/CartContext.tsx admin-panel/contexts/
cp contexts/CartIconContext.tsx admin-panel/contexts/

# ============================================================================
# STEP 5: Copy Types
# ============================================================================
echo "📝 Copying type definitions..."
cp types/product.ts admin-panel/types/

# ============================================================================
# STEP 6: Copy Data
# ============================================================================
echo "💾 Copying data files..."
cp data/products.ts admin-panel/data/

# ============================================================================
# STEP 7: Copy Hooks
# ============================================================================
echo "🪝 Copying custom hooks..."
cp hooks/useTheme.ts admin-panel/hooks/

# ============================================================================
# STEP 8: Copy Styles
# ============================================================================
echo "🎨 Copying styles..."
cp styles/globals.css admin-panel/styles/

# ============================================================================
# STEP 9: Update Import Paths in Admin Panel
# ============================================================================
echo "🔧 Updating import paths..."

# Function to update import paths in a file
update_imports() {
    local file=$1
    
    # Update UI component imports: ../../components/ui/ -> ./components/ui/
    sed -i "s|from '../../components/ui/|from './components/ui/|g" "$file"
    sed -i "s|from \"../../components/ui/|from \"./components/ui/|g" "$file"
    
    # Update admin component imports: ../../components/admin/ -> ./components/
    sed -i "s|from '../../components/admin/|from './components/|g" "$file"
    sed -i "s|from \"../../components/admin/|from \"./components/|g" "$file"
    
    # Update context imports: ../../contexts/ -> ./contexts/
    sed -i "s|from '../../contexts/|from './contexts/|g" "$file"
    sed -i "s|from \"../../contexts/|from \"./contexts/|g" "$file"
    
    # Update data imports: ../../data/ -> ./data/
    sed -i "s|from '../../data/|from './data/|g" "$file"
    sed -i "s|from \"../../data/|from \"./data/|g" "$file"
    
    # Update Logo imports from admin folder
    sed -i "s|from '../components/Logo'|from './components/Logo'|g" "$file"
    sed -i "s|from \"../components/Logo\"|from \"./components/Logo\"|g" "$file"
}

# Update all admin pages
for file in admin-panel/pages/*.tsx; do
    echo "   Updating $file..."
    update_imports "$file"
done

# Update admin components
for file in admin-panel/components/*.tsx; do
    if [ -f "$file" ]; then
        echo "   Updating $file..."
        update_imports "$file"
    fi
done

# ============================================================================
# STEP 10: Clean Up Main App (Remove Admin Files)
# ============================================================================
echo "🧹 Removing admin files from main app..."

# Remove admin pages
rm -rf pages/admin/

# Remove admin components
rm -rf admin/
rm -rf components/admin/

echo ""
echo "✅ Admin Panel Extraction Complete!"
echo "========================================"
echo ""
echo "📦 Admin Panel Location: /admin-panel"
echo "📦 Main App: / (admin files removed)"
echo ""
echo "🎯 Next Steps:"
echo "1. Update /routes.tsx to remove admin routes"
echo "2. Test admin panel independently"
echo "3. Configure separate build processes"
echo "4. Deploy to different domains"
echo ""
echo "📚 See /ADMIN_PANEL_EXTRACTION_COMPLETE.md for full guide"
echo ""
