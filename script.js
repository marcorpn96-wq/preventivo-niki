// Menù predefiniti con categorie
const menus = {
    mare: {
        'APERITIVO DI BENVENUTO': [],
        'ANTIPASTI': [],
        'PRIMI': [],
        'SECONDI': []
    },
    terra: {
        'APERITIVO DI BENVENUTO': [],
        'ANTIPASTI': [],
        'PRIMI': [],
        'SECONDI': []
    },
    pinsabambini: {
        'ANTIPASTO': [],
        'PINSE MISTE FARCITE': [],
    },
    pinsa: {
        'MISTO FRITTO': [],
        'PINSE MISTE FARCITE': [],
    },
    festabambinispiaggia: {
        'MISTO FRITTO': [],
        'PIZZETTE': [],
    },
    festabambinipalmetta: {
        'MISTO FRITTO': [],
        'PIZZETTE': [],
    },
    aperitivo: {
        'PORTATE': [],
    },
    
};

// Bevande disponibili per tutti i menu
const beverages = {
    'BEVANDE': []
};

let rowId = 0;
let beveragesSectionDeleted = false;
let currentMenuKey = null;
let removedCategories = {}; // Traccia le categorie rimosse per menu

function updateMenuNote(menuKey) {
    const note = document.getElementById('menu-note');
    if (!note) return;

    // Per alcuni menù bambini non mostrare la nota "acqua e coperto compresi"
    if (menuKey === 'pinsabambini' || menuKey === 'pinsa' || menuKey === 'aperitivo') {
        note.textContent = ' • Acqua e coperto compresi';
    } else if (menuKey === 'festabambinispiaggia' || menuKey === 'festabambinipalmetta') {
        note.textContent = '';
    } else {

        note.textContent = ' • Acqua, caffè e coperto inclusi';
    }
}

function createInput(type, options = {}) {
    const input = document.createElement('input');
    input.type = type;
    if (options.placeholder !== undefined) input.placeholder = options.placeholder;
    if (options.value !== undefined) input.value = options.value;
    if (options.style !== undefined) input.style.cssText = options.style;
    return input;
}

function createCell(className) {
    const cell = document.createElement('div');
    cell.className = className;
    return cell;
}

function addRow(desc = '') {
    rowId++;
    const tbody = document.getElementById('table-body');
    if (!tbody) return;

    const row = document.createElement('div');
    row.className = 'table-row';
    row.id = `row-${rowId}`;

    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr';
    row.style.width = '100%';
    row.style.borderBottom = '1px solid #eee';

    // COLONNA DESCRIZIONE
    const descCell = createCell('cell');
    descCell.style.flex = '1';
    descCell.style.display = 'flex';
    descCell.style.alignItems = 'center';
    descCell.style.gap = '10px';

    const descInput = createInput('text', {
        placeholder: 'Descrizione voce...',
        value: desc,
        style: 'flex:1; border:none; background:transparent; font-size:18px; outline:none;'
    });

    const ensureBulletPrefix = () => {
        const cleanedValue = (descInput.value || '').replace(/^•\s*/, '');
        descInput.value = cleanedValue ? `• ${cleanedValue}` : '• ';
        requestAnimationFrame(() => {
            const caretPosition = descInput.value.length;
            descInput.setSelectionRange(caretPosition, caretPosition);
        });
    };

    descInput.addEventListener('focus', ensureBulletPrefix);
    descInput.addEventListener('click', ensureBulletPrefix);

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-btn';
    removeButton.type = 'button';
    removeButton.innerHTML = '✕';
    removeButton.style.cursor = 'pointer';
    removeButton.style.background = 'none';
    removeButton.style.border = 'none';
    removeButton.style.color = '#ccc';
    removeButton.addEventListener('click', () => removeRow(row.id));

    descCell.appendChild(descInput);
    descCell.appendChild(removeButton);

    row.appendChild(descCell);
    tbody.appendChild(row);
}

function aggiornaNomeGiorno() {
    const dataInput = document.getElementById('data');
    const displayGiorno = document.getElementById('giorno-settimana');

    if (!dataInput || !displayGiorno) return;

    dataInput.addEventListener('change', () => {
        const dataScelta = new Date(dataInput.value);

        if (!isNaN(dataScelta.getTime())) {
            const opzioni = { weekday: 'long' };
            let nomeGiorno = dataScelta.toLocaleDateString('it-IT', opzioni);

            nomeGiorno = nomeGiorno.charAt(0).toUpperCase() + nomeGiorno.slice(1);

            displayGiorno.textContent = `(${nomeGiorno})`;
        } else {
            displayGiorno.textContent = '';
        }
    });
}

aggiornaNomeGiorno();

function removeRow(id) {
    const el = document.getElementById(id);
    if (el) {
        el.remove();
        calcTotale();
    }
}

function calcTotale() {
    // Il totale è inserito manualmente dall'utente, non viene ricalcolato automaticamente.
}

function toggleOptionalSection(sectionId, restoreBtnId, shouldShow) {
    const section = document.getElementById(sectionId);
    const restoreBtn = document.getElementById(restoreBtnId);
    if (!section || !restoreBtn) return;

    section.style.display = shouldShow ? 'flex' : 'none';
    restoreBtn.style.display = shouldShow ? 'none' : 'inline-flex';
    if (shouldShow) calcTotale();
}

function setupOptionalSectionsControls() {
    const removeButtons = document.querySelectorAll('.remove-section-btn');

    removeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const sectionType = button.getAttribute('data-remove-section');
            if (sectionType === 'reserved') {
                toggleOptionalSection('reserved-section', 'restore-reserved-btn', false);
            } else if (sectionType === 'notes') {
                toggleOptionalSection('notes-section', 'restore-notes-btn', false);
            } else if (sectionType === 'prezzo-persona') {
                toggleOptionalSection('prezzo-persona-section', 'restore-prezzo-persona-btn', false);
            } else if (sectionType === 'prezzo-persona-2') {
                toggleOptionalSection('prezzo-persona-2-section', 'restore-prezzo-persona-2-btn', false);
            } else if (sectionType === 'prezzo-persona-3') {
                toggleOptionalSection('prezzo-persona-3-section', 'restore-prezzo-persona-3-btn', false);
            }
        });
    });

    const restoreReservedBtn = document.getElementById('restore-reserved-btn');
    if (restoreReservedBtn) {
        restoreReservedBtn.addEventListener('click', () => {
            toggleOptionalSection('reserved-section', 'restore-reserved-btn', true);
        });
    }

    const restoreNotesBtn = document.getElementById('restore-notes-btn');
    if (restoreNotesBtn) {
        restoreNotesBtn.addEventListener('click', () => {
            toggleOptionalSection('notes-section', 'restore-notes-btn', true);
        });
    }

    const restorePrezzoPersonaBtn = document.getElementById('restore-prezzo-persona-btn');
    if (restorePrezzoPersonaBtn) {
        restorePrezzoPersonaBtn.addEventListener('click', () => {
            toggleOptionalSection('prezzo-persona-section', 'restore-prezzo-persona-btn', true);
        });
    }

    const restorePrezzoPersona2Btn = document.getElementById('restore-prezzo-persona-2-btn');
    if (restorePrezzoPersona2Btn) {
        restorePrezzoPersona2Btn.addEventListener('click', () => {
            toggleOptionalSection('prezzo-persona-2-section', 'restore-prezzo-persona-2-btn', true);
        });
    }

    const restorePrezzoPersona3Btn = document.getElementById('restore-prezzo-persona-3-btn');
    if (restorePrezzoPersona3Btn) {
        restorePrezzoPersona3Btn.addEventListener('click', () => {
            toggleOptionalSection('prezzo-persona-3-section', 'restore-prezzo-persona-3-btn', true);
        });
    }
}

function clearForm() {
    if (!confirm('Vuoi davvero cancellare tutti i dati?')) return;

    ['cliente', 'persone', 'telefono', 'data', 'email', 'ora', 'menu', 'ambiente', 'area', 'pasto', 'servizio', 'note', 'area-esclusiva', 'prezzo-persona', 'prezzo-persona-2', 'prezzo-persona-3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const totaleDisplay = document.getElementById('totale-display');
    if (totaleDisplay) totaleDisplay.value = '';

    document.getElementById('table-body').replaceChildren();
    rowId = 0;
    initDefaultRows();
    calcTotale();

    toggleOptionalSection('reserved-section', 'restore-reserved-btn', true);
    toggleOptionalSection('notes-section', 'restore-notes-btn', true);
    toggleOptionalSection('prezzo-persona-2-section', 'restore-prezzo-persona-2-btn', true);
    toggleOptionalSection('prezzo-persona-3-section', 'restore-prezzo-persona-3-btn', true);
}

function initDefaultRows() {
    addRow('');
    addRow('');
    addRow('');
}

function createEditableCategoryBlock(categoryName, items = [], options = {}) {
    const categoryContainer = document.createElement('div');
    categoryContainer.style.display = 'flex';
    categoryContainer.style.flexDirection = 'column';
    categoryContainer.style.gap = '2px';
    categoryContainer.setAttribute('data-category', categoryName);

    const categoryTitleWrapper = document.createElement('div');
    categoryTitleWrapper.style.display = 'flex';
    categoryTitleWrapper.style.alignItems = 'center';
    categoryTitleWrapper.style.gap = '4px';

    const categoryTitle = document.createElement('div');
    categoryTitle.style.fontWeight = 'bold';
    categoryTitle.style.fontSize = '15px';
    //categoryTitle.style.marginTop = '8px';
    categoryTitle.style.cursor = 'text';
    categoryTitle.textContent = categoryName;
    categoryTitle.className = 'category-title';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = categoryName;
    titleInput.className = 'category-title-input';
    titleInput.style.display = 'none';
    titleInput.style.flex = '1';
    titleInput.style.border = 'none';
    titleInput.style.outline = 'none';
    titleInput.style.background = 'transparent';
    titleInput.style.fontWeight = 'bold';
    titleInput.style.fontSize = '15px';
    titleInput.style.padding = '0';

    const startTitleEdit = () => {
        titleInput.value = categoryTitle.textContent || '';
        categoryTitle.style.display = 'none';
        titleInput.style.display = 'block';
        requestAnimationFrame(() => {
            titleInput.focus();
            titleInput.select();
        });
    };

    const saveTitleEdit = () => {
        const nextTitle = titleInput.value.trim();
        categoryTitle.textContent = nextTitle || categoryName;
        categoryTitle.style.display = 'block';
        titleInput.style.display = 'none';
    };

    const cancelTitleEdit = () => {
        titleInput.value = categoryTitle.textContent || categoryName;
        categoryTitle.style.display = 'block';
        titleInput.style.display = 'none';
    };

    categoryTitle.addEventListener('click', startTitleEdit);
    titleInput.addEventListener('blur', saveTitleEdit);
    titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveTitleEdit();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            cancelTitleEdit();
        }
    });

    const removeCategoryBtn = document.createElement('button');
    removeCategoryBtn.type = 'button';
    removeCategoryBtn.innerHTML = '✕';
    removeCategoryBtn.style.background = 'none';
    removeCategoryBtn.style.border = 'none';
    removeCategoryBtn.style.color = '#ccc';
    removeCategoryBtn.style.cursor = 'pointer';
    removeCategoryBtn.style.fontSize = '14px';
    removeCategoryBtn.style.padding = '0 4px';
    removeCategoryBtn.addEventListener('click', () => {
        // Salva i dati della categoria prima di rimuoverla
        if (currentMenuKey && !removedCategories[currentMenuKey]) {
            removedCategories[currentMenuKey] = {};
        }
        if (currentMenuKey) {
            // Salva items e indice della categoria
            const menuData = menus[currentMenuKey];
            const allCategoryNames = Object.keys(menuData);
            const categoryIndex = allCategoryNames.indexOf(categoryName);
            const currentCategoryItems = Array.from(categoryList.querySelectorAll('.menu-list-item')).map((el) => el.textContent || '');
            removedCategories[currentMenuKey][categoryName] = { items: currentCategoryItems, index: categoryIndex };
        }
        categoryContainer.remove();
        updateCategoryRestoreButtons(currentMenuKey);
    });

    categoryTitleWrapper.appendChild(categoryTitle);
    categoryTitleWrapper.appendChild(titleInput);
    categoryTitleWrapper.appendChild(removeCategoryBtn);
    categoryContainer.appendChild(categoryTitleWrapper);

    const categoryList = document.createElement('ul');
    categoryList.className = 'menu-selected-list';

    const removedSubcategories = [];
    let removedSubcategoryId = 0;

    const subcategoryRestoreContainer = document.createElement('div');
    subcategoryRestoreContainer.setAttribute('data-restore-subcategories-container', '');
    subcategoryRestoreContainer.style.display = 'none';
    subcategoryRestoreContainer.style.flexDirection = 'column';
    subcategoryRestoreContainer.style.gap = '5px';
    subcategoryRestoreContainer.style.marginTop = '4px';

    const updateSubcategoryRestoreButtons = () => {
        subcategoryRestoreContainer.replaceChildren();

        if (removedSubcategories.length === 0) {
            subcategoryRestoreContainer.style.display = 'none';
            return;
        }

        subcategoryRestoreContainer.style.display = 'flex';

        removedSubcategories.forEach((removedSubcategory) => {
            const restoreBtn = document.createElement('button');
            restoreBtn.type = 'button';
            restoreBtn.setAttribute('data-restore-subcategory-btn', String(removedSubcategory.id));
            restoreBtn.textContent = '↻ Ripristina voce';
            restoreBtn.style.padding = '3px 8px';
            restoreBtn.style.backgroundColor = '#f0f0f0';
            restoreBtn.style.border = '1px solid #ddd';
            restoreBtn.style.borderRadius = '4px';
            restoreBtn.style.cursor = 'pointer';
            restoreBtn.style.fontSize = '12px';
            restoreBtn.style.fontWeight = '500';
            restoreBtn.style.width = 'fit-content';

            restoreBtn.addEventListener('click', () => {
                const currentChildren = Array.from(categoryList.children);
                addItemToList(removedSubcategory.text, removedSubcategory.index);

                const removedIndex = removedSubcategories.findIndex((entry) => entry.id === removedSubcategory.id);
                if (removedIndex !== -1) {
                    removedSubcategories.splice(removedIndex, 1);
                }

                // Aggiorna indici solo se il ripristino è in mezzo alla lista
                if (removedSubcategory.index < currentChildren.length) {
                    removedSubcategories.forEach((entry) => {
                        if (entry.index >= removedSubcategory.index) {
                            entry.index += 1;
                        }
                    });
                }

                updateSubcategoryRestoreButtons();
            });

            subcategoryRestoreContainer.appendChild(restoreBtn);
        });
    };

    const addItemToList = (itemText = '', insertIndex = null) => {
        const listItem = document.createElement('li');
        listItem.style.listStyle = 'none';
        listItem.style.padding = '3px 0';
        listItem.style.paddingLeft = '2px';

        const liWrapper = document.createElement('div');
        liWrapper.style.display = 'flex';
        liWrapper.style.alignItems = 'center';
        liWrapper.style.gap = '4px';

        const li = document.createElement('li');
        li.className = 'menu-list-item';
        li.contentEditable = 'true';
        li.textContent = itemText;
        li.style.flex = '1';
        li.style.listStyle = 'disc';
        li.style.marginLeft = '0';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-item-btn';
        removeBtn.innerHTML = '✕';
        removeBtn.style.background = 'none';
        removeBtn.style.border = 'none';
        removeBtn.style.color = '#ccc';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '14px';
        removeBtn.style.padding = '0 4px';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            const currentIndex = Array.from(categoryList.children).indexOf(listItem);
            removedSubcategories.push({
                id: ++removedSubcategoryId,
                text: li.textContent || '',
                index: currentIndex
            });

            listItem.remove();
            updateSubcategoryRestoreButtons();
        });

        liWrapper.appendChild(li);
        liWrapper.appendChild(removeBtn);
        listItem.appendChild(liWrapper);

        if (insertIndex === null || insertIndex < 0 || insertIndex >= categoryList.children.length) {
            categoryList.appendChild(listItem);
        } else {
            categoryList.insertBefore(listItem, categoryList.children[insertIndex]);
        }
    };

    items.forEach(item => addItemToList(item));

    if (items.length === 0) {
        const emptyLines = options.emptyLines ?? 3;
        for (let i = 0; i < emptyLines; i++) {
            addItemToList('');
        }
    }

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-list-item-btn';
    addBtn.textContent = options.addButtonText || ('+ Aggiungi voce a ' + categoryName);
    addBtn.style.marginTop = '4px';
    addBtn.style.padding = '4px 8px';
    addBtn.style.fontSize = '11px';
    addBtn.addEventListener('click', () => {
        addItemToList('');
        const lastItem = categoryList.lastElementChild?.querySelector('.menu-list-item');
        if (lastItem) {
            requestAnimationFrame(() => lastItem.focus());
        }
    });

    categoryContainer.appendChild(categoryList);
    categoryContainer.appendChild(addBtn);
    categoryContainer.appendChild(subcategoryRestoreContainer);

    return categoryContainer;
}

function updateCategoryRestoreButtons(menuKey) {
    if (!menuKey) return;
    
    const container = document.querySelector('[data-categories-container]');
    if (!container) return;

    // Rimuovi il contenitore dei pulsanti di ripristino precedente
    const existingRestoreContainer = container.querySelector('[data-restore-buttons-container]');
    if (existingRestoreContainer) {
        existingRestoreContainer.remove();
    }

    // Aggiungi nuovi pulsanti per le categorie rimosse
    if (removedCategories[menuKey] && Object.keys(removedCategories[menuKey]).length > 0) {
        const restoreContainer = document.createElement('div');
        restoreContainer.setAttribute('data-restore-buttons-container', '');
        restoreContainer.style.marginTop = '10px';
        restoreContainer.style.display = 'flex';
        restoreContainer.style.flexDirection = 'column';
        restoreContainer.style.gap = '8px';

        Object.entries(removedCategories[menuKey]).forEach(([categoryName, categoryData]) => {
            const restoreBtn = document.createElement('button');
            restoreBtn.setAttribute('data-restore-category-btn', categoryName);
            restoreBtn.type = 'button';
            restoreBtn.textContent = `↻ Ripristina ${categoryName}`;
            restoreBtn.style.padding = '8px 12px';
            restoreBtn.style.backgroundColor = '#f0f0f0';
            restoreBtn.style.border = '1px solid #ddd';
            restoreBtn.style.borderRadius = '4px';
            restoreBtn.style.cursor = 'pointer';
            restoreBtn.style.fontSize = '11px';
            restoreBtn.style.fontWeight = '500';
            
            restoreBtn.addEventListener('click', () => {
                // Ripristina la categoria
                const items = categoryData.items;
                const newCategoryBlock = createEditableCategoryBlock(categoryName, items, {
                    emptyLines: 3
                });
                
                // Trova la posizione corretta nel DOM
                const existingCategories = container.querySelectorAll('[data-category]');
                const menuData = menus[menuKey];
                const allCategoryNames = Object.keys(menuData);
                const targetIndex = categoryData.index;
                
                // Trova il primo elemento con indice maggiore per inserire prima di esso
                let insertBeforeElement = null;
                for (let i = 0; i < existingCategories.length; i++) {
                    const existingName = existingCategories[i].getAttribute('data-category');
                    const existingIndex = allCategoryNames.indexOf(existingName);
                    if (existingIndex > targetIndex) {
                        insertBeforeElement = existingCategories[i];
                        break;
                    }
                }
                
                if (insertBeforeElement) {
                    container.insertBefore(newCategoryBlock, insertBeforeElement);
                } else {
                    // Se non c'è niente da inserire prima, aggiungi prima dei pulsanti di ripristino
                    const restoreButtonsContainer = container.querySelector('[data-restore-buttons-container]');
                    if (restoreButtonsContainer) {
                        container.insertBefore(newCategoryBlock, restoreButtonsContainer);
                    } else {
                        container.appendChild(newCategoryBlock);
                    }
                }
                
                // Rimuovi dai pulsanti rimossi
                delete removedCategories[menuKey][categoryName];
                
                // Aggiorna i pulsanti di ripristino
                updateCategoryRestoreButtons(menuKey);
            });
            
            restoreContainer.appendChild(restoreBtn);
        });

        container.appendChild(restoreContainer);
    }
}

function renderBeveragesSection() {
    const section = document.getElementById('beverages-section');
    if (!section) return;

    section.replaceChildren();
    beveragesSectionDeleted = false;
    
    // Nascondi il pulsante di ripristino se esiste
    const restoreBtn = document.getElementById('restore-beverages-btn');
    if (restoreBtn) {
        restoreBtn.style.display = 'none';
    }

    const titleBar = document.createElement('div');
    titleBar.className = 'table-header';
    titleBar.style.display = 'flex';
    titleBar.style.alignItems = 'center';
    titleBar.style.justifyContent = 'space-between';

    const titleText = document.createElement('div');
    titleText.textContent = 'BEVANDE';

    const removeSectionBtn = document.createElement('button');
    removeSectionBtn.type = 'button';
    removeSectionBtn.innerHTML = '✕';
    removeSectionBtn.style.background = 'none';
    removeSectionBtn.style.border = 'none';
    removeSectionBtn.style.color = '#fff';
    removeSectionBtn.style.cursor = 'pointer';
    removeSectionBtn.style.fontSize = '14px';
    removeSectionBtn.style.padding = '0 16px 0 0';
    removeSectionBtn.addEventListener('click', () => {
        section.replaceChildren();
        beveragesSectionDeleted = true;
        
        // Mostra il pulsante di ripristino
        const restoreBtnElement = document.getElementById('restore-beverages-btn');
        if (restoreBtnElement) {
            restoreBtnElement.style.display = 'block';
        }
    });

    titleBar.appendChild(titleText);
    titleBar.appendChild(removeSectionBtn);

    const body = document.createElement('div');
    body.className = 'table-body';

    const inner = document.createElement('div');
    inner.style.padding = '10px';

    const beveragesList = document.createElement('ul');
    beveragesList.className = 'menu-selected-list';
    beveragesList.style.margin = '0';
    beveragesList.style.paddingLeft = '16px';

    const addBeverageLine = (text = '') => {
        const listItem = document.createElement('li');
        listItem.style.listStyle = 'disc';
        listItem.style.padding = '1px 0';
        listItem.style.paddingLeft = '4px';

        const liWrapper = document.createElement('div');
        liWrapper.style.display = 'flex';
        liWrapper.style.alignItems = 'center';
        liWrapper.style.gap = '6px';

        const beverageContent = document.createElement('div');
        beverageContent.contentEditable = 'true';
        beverageContent.className = 'menu-list-item';
        beverageContent.textContent = text;
        beverageContent.style.flex = '1';
        beverageContent.style.outline = 'none';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.innerHTML = '✕';
        removeBtn.style.background = 'none';
        removeBtn.style.border = 'none';
        removeBtn.style.color = '#ccc';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '14px';
        removeBtn.style.padding = '0 4px';
        removeBtn.addEventListener('click', () => listItem.remove());

        liWrapper.appendChild(beverageContent);
        liWrapper.appendChild(removeBtn);
        listItem.appendChild(liWrapper);
        beveragesList.appendChild(listItem);
    };

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-list-item-btn';
    addBtn.textContent = '+ Aggiungi bevanda';
    addBtn.addEventListener('click', () => {
        addBeverageLine('');
        const lastItem = beveragesList.lastElementChild?.querySelector('[contenteditable="true"]');
        if (lastItem) {
            requestAnimationFrame(() => lastItem.focus());
        }
    });

    inner.appendChild(beveragesList);
    inner.appendChild(addBtn);

    body.appendChild(inner);
    section.appendChild(titleBar);
    section.appendChild(body);
}

// Create a special description row for a selected menu: big bold title + editable list
function createMenuDescriptionRow(menuKey) {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;

    // Imposta il menu corrente e pulisci le categorie rimosse
    currentMenuKey = menuKey;
    updateMenuNote(menuKey);
    if (!removedCategories[menuKey]) {
        removedCategories[menuKey] = {};
    } else {
        removedCategories[menuKey] = {}; // Pulisci all'apertura di un nuovo menu
    }

    rowId++;
    const row = document.createElement('div');
    row.className = 'table-row';
    row.id = `row-${rowId}`;
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr';
    row.style.width = '100%';
    row.style.borderBottom = '1px solid #eee';

    const descCell = createCell('cell');
    descCell.style.display = 'flex';
    descCell.style.flexDirection = 'column';
    descCell.style.gap = '4px';

    // title (big + bold)
    const menuSelect = document.getElementById('menu');
    const label = menuSelect ? (menuSelect.selectedOptions[0]?.textContent || menuKey) : menuKey;
    const title = document.createElement('div');
    title.className = 'menu-selected-title';
    title.textContent = label;

    // Verifica se il menu ha categorie (ANTIPASTI, PRIMI, SECONDI) o è una lista semplice
    const menuData = menus[menuKey];
    const hasCategories = menuData && typeof menuData === 'object' && !Array.isArray(menuData);

    if (hasCategories) {
        // Struttura con categorie
        const categoriesContainer = document.createElement('div');
        categoriesContainer.setAttribute('data-categories-container', '');
        categoriesContainer.style.display = 'flex';
        categoriesContainer.style.flexDirection = 'column';
        categoriesContainer.style.gap = '6px';

        Object.entries(menuData).forEach(([categoryName, items]) => {
            categoriesContainer.appendChild(createEditableCategoryBlock(categoryName, items, {
                emptyLines: 3
            }));
        });

        descCell.appendChild(title);
        descCell.appendChild(categoriesContainer);
        
        // Aggiorna i pulsanti di ripristino dopo aver creato le categorie
        updateCategoryRestoreButtons(menuKey);
    } else if (Array.isArray(menuData)) {
        // Struttura semplice (lista di oggetti con name)
        const list = document.createElement('ul');
        list.className = 'menu-selected-list';
        menuData.forEach(item => {
            const liWrapper = document.createElement('div');
            liWrapper.style.display = 'flex';
            liWrapper.style.alignItems = 'center';
            liWrapper.style.gap = '8px';

            const li = document.createElement('li');
            li.className = 'menu-list-item';
            li.contentEditable = 'true';
            li.textContent = item.name;
            li.style.flex = '1';
            li.style.listStyle = 'disc';
            li.style.marginLeft = '0';

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-item-btn';
            removeBtn.innerHTML = '✕';
            removeBtn.style.background = 'none';
            removeBtn.style.border = 'none';
            removeBtn.style.color = '#ccc';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.fontSize = '14px';
            removeBtn.style.padding = '0 4px';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                liWrapper.remove();
            });

            liWrapper.appendChild(li);
            liWrapper.appendChild(removeBtn);

            const listItem = document.createElement('li');
            listItem.style.listStyle = 'none';
            listItem.style.padding = '6px 0';
            listItem.style.paddingLeft = '4px';
            listItem.appendChild(liWrapper);
            list.appendChild(listItem);
        });

        descCell.appendChild(title);
        descCell.appendChild(list);
    }

    // controls (add item, remove row)
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '8px';
    controls.style.marginTop = '2px';

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-btn';
    removeButton.type = 'button';
    removeButton.innerHTML = '✕';
    removeButton.style.marginLeft = 'auto';
    removeButton.addEventListener('click', () => removeRow(row.id));

    controls.appendChild(removeButton);

    descCell.appendChild(controls);

    row.appendChild(descCell);
    tableBody.appendChild(row);
}

function createRestoreBeveragesButton() {
    const section = document.getElementById('beverages-section');
    if (!section) return;

    // Verifica se il pulsante esiste già
    let restoreBtn = document.getElementById('restore-beverages-btn');
    if (!restoreBtn) {
        restoreBtn = document.createElement('button');
        restoreBtn.id = 'restore-beverages-btn';
        restoreBtn.type = 'button';
        restoreBtn.textContent = '↻ Ripristina Bevande';
        restoreBtn.style.marginTop = '10px';
        restoreBtn.style.padding = '10px 16px';
        restoreBtn.style.backgroundColor = '#f0f0f0';
        restoreBtn.style.border = '1px solid #ddd';
        restoreBtn.style.borderRadius = '4px';
        restoreBtn.style.cursor = 'pointer';
        restoreBtn.style.fontSize = '12px';
        restoreBtn.style.fontWeight = '500';
        restoreBtn.style.display = 'none';
        restoreBtn.addEventListener('click', () => {
            renderBeveragesSection();
        });
        
        section.parentNode.insertBefore(restoreBtn, section.nextSibling);
    }
}

function bindPageEvents() {
    const clearButton = document.querySelector('.btn-clear');
    const printButton = document.querySelector('.btn-print');
    const addRowButton = document.querySelector('.add-row-btn');
    const totaleDisplay = document.getElementById('totale-display');
    const menuSelect = document.getElementById('menu');

    if (clearButton && clearButton.id !== 'btn-carica' && clearButton.id !== 'btn-salva') clearButton.addEventListener('click', clearForm);
    if (printButton) printButton.addEventListener('click', () => window.print());
    if (addRowButton) addRowButton.addEventListener('click', () => addRow());
    if (totaleDisplay) {
        totaleDisplay.addEventListener('change', calcTotale);
    }

    // Evento per popolare la tabella quando si seleziona un menù
    if (menuSelect) {
        menuSelect.addEventListener('change', (e) => {
            const selectedMenu = e.target.value;
            updateMenuNote(selectedMenu);
            const tableBody = document.getElementById('table-body');
            tableBody.replaceChildren();
            rowId = 0;

            if (!selectedMenu) {
                initDefaultRows();
                return;
            }

            if (menus[selectedMenu]) {
                createMenuDescriptionRow(selectedMenu);
            } else {
                initDefaultRows();
            }

            renderBeveragesSection();
            createRestoreBeveragesButton();
            calcTotale();
        });
    }

}

bindPageEvents();
initDefaultRows();
renderBeveragesSection();
createRestoreBeveragesButton();
updateMenuNote(document.getElementById('menu')?.value || '');
setupOptionalSectionsControls();
calcTotale();


// =========================================================
// SISTEMA DI SALVATAGGIO E CARICAMENTO AVANZATO (Anti-Crash)
// =========================================================

function getPreventivoStorage() {
    const storageCandidates = [window.localStorage, window.sessionStorage];

    for (const storage of storageCandidates) {
        try {
            const testKey = '__preventivo_storage_test__';
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return storage;
        } catch (error) {
            // Prova il prossimo storage disponibile.
        }
    }

    return null;
}

function salvaPreventivo() {
    try {
        const nomeCliente = document.getElementById('cliente').value.trim();
        if (!nomeCliente) {
            alert("Inserisci il nome del cliente per poter salvare il preventivo!");
            return;
        }

        const getValue = (id) => document.getElementById(id) ? document.getElementById(id).value : '';

        // 1. Raccogliamo tutti i dati base
        const datiPreventivo = {
            cliente: nomeCliente,
            persone: getValue('persone'),
            telefono: getValue('telefono'),
            data: getValue('data'),
            email: getValue('email'),
            ora: getValue('ora'),
            ambiente: getValue('ambiente'),
            area: getValue('area'),
            pasto: getValue('pasto'),
            servizio: getValue('servizio'),
            menu: getValue('menu'),
            note: getValue('note'),
            areaEsclusiva: getValue('area-esclusiva'),
            prezzoPersona: getValue('prezzo-persona'),
            prezzoPersona2: getValue('prezzo-persona-2'),
            prezzoPersona3: getValue('prezzo-persona-3'),
            reservedVisible: document.getElementById('reserved-section')?.style.display !== 'none',
            notesVisible: document.getElementById('notes-section')?.style.display !== 'none',
            prezzoPersonaVisible: document.getElementById('prezzo-persona-section')?.style.display !== 'none',
            prezzoPersona2Visible: document.getElementById('prezzo-persona-2-section')?.style.display !== 'none',
            prezzoPersona3Visible: document.getElementById('prezzo-persona-3-section')?.style.display !== 'none',
            totale: getValue('totale-display'),
            menuData: null,
            beveragesData: [],
            customRowsData: [],
            beveragesDeleted: false
        };

        // 2. Estrazione sicura del Menù
        const categoriesContainer = document.querySelector('[data-categories-container]');
        if (categoriesContainer) {
            datiPreventivo.menuData = {};
            categoriesContainer.querySelectorAll('[data-category]').forEach(catEl => {
                // Prende il nome della categoria in modo sicuro (usa la classe dedicata)
                let titleDiv = catEl.querySelector('.category-title');
                let catName = titleDiv ? (titleDiv.textContent || '').trim() : catEl.getAttribute('data-category');
                
                let items = Array.from(catEl.querySelectorAll('.menu-list-item')).map(li => (li.textContent || '').trim());
                datiPreventivo.menuData[catName] = items;
            });
        } else {
            const simpleList = document.querySelector('#table-body .menu-selected-list');
            if (simpleList) {
                datiPreventivo.menuData = Array.from(simpleList.querySelectorAll('.menu-list-item')).map(li => ({ name: (li.textContent || '').trim() }));
            }
        }

        // 3. Estrazione sicura delle Bevande
        const bevSection = document.getElementById('beverages-section');
        if (bevSection && bevSection.children.length === 0) {
            datiPreventivo.beveragesDeleted = true;
        } else if (bevSection) {
            bevSection.querySelectorAll('.menu-list-item').forEach(bev => {
                datiPreventivo.beveragesData.push((bev.textContent || '').trim());
            });
        }

        // 4. Estrazione delle Righe Aggiuntive extra
        document.querySelectorAll('#table-body .table-row').forEach(row => {
            if (!row.querySelector('.menu-selected-title')) {
                let input = row.querySelector('input[type="text"]');
                if (input && input.value) datiPreventivo.customRowsData.push(input.value);
            }
        });

        // 5. Salvataggio
        const chiaveDati = "preventivo_" + nomeCliente.toLowerCase().replace(/\s+/g, '_');
        const storage = getPreventivoStorage();
        if (!storage) {
            throw new Error('Storage non disponibile nel browser.');
        }

        storage.setItem(chiaveDati, JSON.stringify(datiPreventivo));
        
        alert("✅ Preventivo di " + nomeCliente + " salvato con successo (incluse le modifiche ai piatti)!");
    } catch (error) {
        console.error("Errore durante il salvataggio:", error);
        alert("Si è verificato un errore nel salvataggio. Premi F12 per controllare la Console.");
    }
}

function caricaPreventivo() {
    try {
        const nomeDaCercare = prompt("Inserisci il nome del cliente del preventivo da caricare:");
        if (!nomeDaCercare) return;

        const chiaveDati = "preventivo_" + nomeDaCercare.toLowerCase().replace(/\s+/g, '_');
        const storage = getPreventivoStorage();
        if (!storage) {
            throw new Error('Storage non disponibile nel browser.');
        }

        const datiSalvati = storage.getItem(chiaveDati);

        if (!datiSalvati) {
            alert("❌ Nessun preventivo trovato per questo cliente nel tuo browser.");
            return;
        }

        const dati = JSON.parse(datiSalvati);

        // Small sanitizer to remove stray remove-button symbols from older saved entries
        const sanitizeTrailingX = (s) => {
            if (!s && s !== '') return '';
            return String(s).replace(/[\u2715\u2716\u00D7]+$/g, '').trim();
        };

        // 1. Ripristino dei campi base
        const setValue = (id, value) => { if (document.getElementById(id)) document.getElementById(id).value = value || ''; };
        
        ['cliente', 'persone', 'telefono', 'data', 'email', 'ora', 'ambiente', 'area', 'pasto', 'servizio', 'note'].forEach(id => {
            setValue(id, dati[id]);
        });

        // Aggiorna il giorno della settimana dopo aver caricato la data
        if (dati.data) {
            const displayGiorno = document.getElementById('giorno-settimana');
            if (displayGiorno) {
                const parts = dati.data.split('-');
                const dataScelta = parts.length === 3
                    ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
                    : new Date(dati.data);
                if (!isNaN(dataScelta.getTime())) {
                    let nomeGiorno = dataScelta.toLocaleDateString('it-IT', { weekday: 'long' });
                    nomeGiorno = nomeGiorno.charAt(0).toUpperCase() + nomeGiorno.slice(1);
                    displayGiorno.textContent = `(${nomeGiorno})`;
                }
            }
        }
        setValue('area-esclusiva', dati.areaEsclusiva);
        setValue('prezzo-persona', dati.prezzoPersona);
        setValue('prezzo-persona-2', dati.prezzoPersona2);
        setValue('prezzo-persona-3', dati.prezzoPersona3);
        setValue('totale-display', dati.totale);

        if (dati.reservedVisible === false) {
            toggleOptionalSection('reserved-section', 'restore-reserved-btn', false);
        } else {
            toggleOptionalSection('reserved-section', 'restore-reserved-btn', true);
        }
        if (dati.notesVisible === false) {
            toggleOptionalSection('notes-section', 'restore-notes-btn', false);
        } else {
            toggleOptionalSection('notes-section', 'restore-notes-btn', true);
        }
        if (dati.prezzoPersonaVisible === false) {
            toggleOptionalSection('prezzo-persona-section', 'restore-prezzo-persona-btn', false);
        } else {
            toggleOptionalSection('prezzo-persona-section', 'restore-prezzo-persona-btn', true);
        }
        if (dati.prezzoPersona2Visible === false) {
            toggleOptionalSection('prezzo-persona-2-section', 'restore-prezzo-persona-2-btn', false);
        } else {
            toggleOptionalSection('prezzo-persona-2-section', 'restore-prezzo-persona-2-btn', true);
        }
        if (dati.prezzoPersona3Visible === false) {
            toggleOptionalSection('prezzo-persona-3-section', 'restore-prezzo-persona-3-btn', false);
        } else {
            toggleOptionalSection('prezzo-persona-3-section', 'restore-prezzo-persona-3-btn', true);
        }

        // 2. Ripristino del Menù con il "trucco" per i piatti modificati
        const menuSelect = document.getElementById('menu');
        menuSelect.value = dati.menu || '';
        
        // Sanitize incoming menuData to strip any trailing '✕' or similar symbols (from older saves)
        if (dati.menuData) {
            if (Array.isArray(dati.menuData)) {
                dati.menuData = dati.menuData.map(it => ({ name: sanitizeTrailingX(it.name) }));
            } else if (typeof dati.menuData === 'object') {
                const cleaned = {};
                Object.entries(dati.menuData).forEach(([k, v]) => {
                    const cleanKey = sanitizeTrailingX(k);
                    if (Array.isArray(v)) {
                        cleaned[cleanKey] = v.map(item => sanitizeTrailingX(item));
                    } else {
                        cleaned[cleanKey] = v;
                    }
                });
                dati.menuData = cleaned;
            }
        }

        if (dati.menu && dati.menuData && menus[dati.menu]) {
            // Salva l'originale, sostituisci con il modificato, genera e ripristina
            const menuOriginale = JSON.parse(JSON.stringify(menus[dati.menu]));
            menus[dati.menu] = dati.menuData;
            menuSelect.dispatchEvent(new Event('change'));
            menus[dati.menu] = menuOriginale;
        } else {
            menuSelect.dispatchEvent(new Event('change'));
            if (!dati.menu) {
                document.getElementById('table-body').replaceChildren();
                if (typeof initDefaultRows === 'function') initDefaultRows();
            }
        }

        // 3. Ripristino delle Righe Extra
        if (dati.customRowsData && dati.customRowsData.length > 0) {
            dati.customRowsData.forEach(testo => {
                if (typeof addRow === 'function') addRow(sanitizeTrailingX(testo));
            });
        }

        // 4. Ripristino delle Bevande
        if (dati.beveragesDeleted) {
            const removeBevBtn = document.querySelector('#beverages-section .table-header button');
            if (removeBevBtn) removeBevBtn.click();
        } else if (dati.beveragesData && dati.beveragesData.length > 0) {
            const btnAddBev = document.querySelector('#beverages-section .add-list-item-btn');
            if (btnAddBev) {
                dati.beveragesData.forEach(testo => {
                    btnAddBev.click();
                    const vociCreate = document.querySelectorAll('#beverages-section .menu-list-item');
                    if (vociCreate.length > 0) {
                        vociCreate[vociCreate.length - 1].textContent = sanitizeTrailingX(testo);
                    }
                });
            }
        }

        // Aggiorna il conto finale
        if (typeof calcTotale === 'function') calcTotale();

        alert("📂 Preventivo caricato esattamente com'era!");
    } catch (error) {
        console.error("Errore durante il caricamento:", error);
        alert("Si è verificato un errore nel caricamento. Premi F12 per controllare la Console.");
    }
}

// 3. Collegamento automatico dei bottoni senza toccare altro codice
document.addEventListener('DOMContentLoaded', () => {
    // Cerca i bottoni salvataggio/caricamento creati nell'HTML
    const btnSalva = document.getElementById('btn-salva');
    const btnCarica = document.getElementById('btn-carica');
    
    if (btnSalva) btnSalva.addEventListener('click', salvaPreventivo);
    if (btnCarica) btnCarica.addEventListener('click', caricaPreventivo);
});