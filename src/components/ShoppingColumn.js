import ShoppingItemRow from "./ShoppingItemRow";

export default function ShoppingColumn({
  title,
  emptyText,
  items,
  editingItemId,
  setEditingItemId,
  updateItem,
  toggleBought,
  removeItem,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 p-4 bg-stone-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">{title}</h4>
        <span className="text-sm text-stone-500">
          € {items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)}
        </span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-stone-400">{emptyText}</div>
        ) : (
          items.map((item) => {
            const isEditing = editingItemId === item.id;

            return (
              <ShoppingItemRow
                key={item.id}
                item={item}
                isEditing={isEditing}
                onToggleBought={toggleBought}
                onUpdateItem={updateItem}
                onToggleEdit={(id) =>
                  setEditingItemId(isEditing ? null : id)
                }
                onRemoveItem={removeItem}
              />
            );
          })
        )}
      </div>
    </div>
  );
}