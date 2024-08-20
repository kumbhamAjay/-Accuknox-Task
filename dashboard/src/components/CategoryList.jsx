import React, { useState, useEffect } from 'react';

export const CategoryList = () => {
  const initialCategories = JSON.parse(localStorage.getItem('categories')) || [
    {
      id: 1,
      name: 'Category 1',
      widgets: [
        { id: 1, title: 'Widget 1.1', description: 'Description for Widget 1.1' },
        { id: 2, title: 'Widget 1.2', description: 'Description for Widget 1.2' },
      ],
    },
    {
      id: 2,
      name: 'Category 2',
      widgets: [
        { id: 1, title: 'Widget 2.1', description: 'Description for Widget 2.1' },
        { id: 2, title: 'Widget 2.2', description: 'Description for Widget 2.2' },
      ],
    },
    {
      id: 3,
      name: 'Category 3',
      widgets: [
        { id: 1, title: 'Widget 3.1', description: 'Description for Widget 3.1' },
        { id: 2, title: 'Widget 3.2', description: 'Description for Widget 3.2' },
      ],
    },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [widgetName, setWidgetName] = useState('');
  const [widgetDescription, setWidgetDescription] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [widgetSearchTerm, setWidgetSearchTerm] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingWidgetId, setEditingWidgetId] = useState(null);
  const [editingWidgetTitle, setEditingWidgetTitle] = useState('');
  const [editingWidgetDescription, setEditingWidgetDescription] = useState('');

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleClick = (category) => {
    setSelectedCategory(category);
    setWidgetSearchTerm('');
  };

  const handleAddWidget = () => {
    if (!widgetName || !widgetDescription || !selectedCategory) return;

    const newWidget = {
      id: selectedCategory.widgets.length + 1,
      title: widgetName,
      description: widgetDescription,
    };

    const updatedCategories = categories.map((category) =>
      category.id === selectedCategory.id
        ? { ...category, widgets: [...category.widgets, newWidget] }
        : category
    );

    setCategories(updatedCategories);

    // Update the selectedCategory with the new widget added
    setSelectedCategory({
      ...selectedCategory,
      widgets: [...selectedCategory.widgets, newWidget],
    });

    setWidgetName('');
    setWidgetDescription('');
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;

    const newCategory = {
      id: categories.length + 1,
      name: newCategoryName,
      widgets: [],
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const handleEditCategory = (categoryId, newName) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId ? { ...category, name: newName } : category
      )
    );
    setEditingCategoryId(null);
  };

  const handleEditWidget = () => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              widgets: category.widgets.map((widget) =>
                widget.id === editingWidgetId
                  ? {
                      ...widget,
                      title: editingWidgetTitle,
                      description: editingWidgetDescription,
                    }
                  : widget
              ),
            }
          : category
      )
    );

    setEditingWidgetId(null);
    setEditingWidgetTitle('');
    setEditingWidgetDescription('');

    setSelectedCategory((prevCategory) => ({
      ...prevCategory,
      widgets: prevCategory.widgets.map((widget) =>
        widget.id === editingWidgetId
          ? {
              ...widget,
              title: editingWidgetTitle,
              description: editingWidgetDescription,
            }
          : widget
      ),
    }));
  };

  const handleDeleteCategory = (categoryId) => {
    const updatedCategories = categories.filter((category) => category.id !== categoryId);
    setCategories(updatedCategories);
    if (selectedCategory && selectedCategory.id === categoryId) {
      setSelectedCategory(null);
    }
  };

  const handleDeleteWidget = (widgetId) => {
    if (!selectedCategory) return;

    const updatedCategories = categories.map((category) =>
      category.id === selectedCategory.id
        ? {
            ...category,
            widgets: category.widgets.filter((widget) => widget.id !== widgetId),
          }
        : category
    );

    setCategories(updatedCategories);
    setSelectedCategory((prevCategory) => ({
      ...prevCategory,
      widgets: prevCategory.widgets.filter((widget) => widget.id !== widgetId),
    }));
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const filteredWidgets = selectedCategory
    ? selectedCategory.widgets.filter((widget) =>
        widget.title.toLowerCase().includes(widgetSearchTerm.toLowerCase())
      )
    : [];

  const startEditingWidget = (widget) => {
    setEditingWidgetId(widget.id);
    setEditingWidgetTitle(widget.title);
    setEditingWidgetDescription(widget.description);
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.sidebar}>
        <div style={styles.addCategoryContainer}>
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddCategory} style={styles.addButton}>
            Add Category
          </button>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search Categories"
            value={categorySearchTerm}
            onChange={(e) => setCategorySearchTerm(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.categoryList}>
          {filteredCategories.map((category) => (
            <div key={category.id} style={styles.categoryContainer}>
              {editingCategoryId === category.id ? (
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleEditCategory(category.id, e.target.value)}
                  onBlur={() => setEditingCategoryId(null)}
                  autoFocus
                  style={styles.input}
                />
              ) : (
                <div style={styles.category} onClick={() => handleClick(category)}>
                  {category.name}
                </div>
              )}
              <div style={styles.categoryButtons}>
              <button onClick={() => setEditingCategoryId(category.id)} style={styles.editButton}>
                Edit
              </button>
              <button onClick={() => handleDeleteCategory(category.id)} style={styles.deleteButton}>
                Delete
              </button>

              </div>

            </div>
          ))}
        </div>
      </div>

      <div style={styles.mainContent}>
        {selectedCategory && (
          <div style={styles.widgetsContainer}>
            <h2>{selectedCategory.name} Widgets</h2>
            <div style={styles.inputContainer}>
              <input
                type="text"
                placeholder="Widget Name"
                value={widgetName}
                onChange={(e) => setWidgetName(e.target.value)}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Widget Description"
                value={widgetDescription}
                onChange={(e) => setWidgetDescription(e.target.value)}
                style={styles.input}
              />
              <button onClick={handleAddWidget} style={styles.addButton}>
                Add Widget
              </button>
            </div>

            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search Widgets"
                value={widgetSearchTerm}
                onChange={(e) => setWidgetSearchTerm(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.cardsContainer}>
              {filteredWidgets.map((widget) => (
                <div key={widget.id} style={styles.cardContainer}>
                  {editingWidgetId === widget.id ? (
                    <div style={styles.card}>
                      <input
                        type="text"
                        value={editingWidgetTitle}
                        onChange={(e) => setEditingWidgetTitle(e.target.value)}
                        placeholder="Edit Widget Title"
                        style={styles.input}
                      />
                      <input
                        type="text"
                        value={editingWidgetDescription}
                        onChange={(e) => setEditingWidgetDescription(e.target.value)}
                        placeholder="Edit Widget Description"
                        style={styles.input}
                      />
                      <button onClick={handleEditWidget} style={styles.addButton}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <div style={styles.card}>
                      <h3>{widget.title}</h3>
                      <p>{widget.description}</p>
                      <button onClick={() => startEditingWidget(widget)} style={styles.editButton}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteWidget(widget.id)} style={styles.deleteButton}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    borderRight: '1px solid #ccc',
    overflowY: 'auto',
  },
  addCategoryContainer:{
    display:'flex',
    gap:"5px",
    marginBottom:'5px'
  },
  categoryButtons:{
    display:'flex',
    justifyContent:'space-between'
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    marginRight: '10px',
    flex: 1,
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchContainer: {
    marginBottom: '20px',
    display:'flex'
  },
  categoryList: {
    maxHeight: '400px',
    overflowY: 'auto',
    // border:'1px solid'
  },
  categoryContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    backgroundColor:'white'
  },
  category: {
    cursor: 'pointer',
    backgroundColor:'white'

  },
  editButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
    padding: '5px 10px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
    padding: '5px 10px',
  },
  widgetsContainer: {
    marginBottom: '20px',
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  cardContainer: {
    width: 'calc(33.33% - 20px)',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
};

export default CategoryList;
