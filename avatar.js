// Avatar System for Metaverse Application

class AvatarRenderer {
    constructor() {
        this.baseUrl = 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/';
        this.currentView = 'front';
        this.loadedSVGs = new Map();
        this.isLoading = false;
    }

    // Load SVG content from GitHub with better error handling
    async loadSVG(filename) {
        if (this.loadedSVGs.has(filename)) {
            return this.loadedSVGs.get(filename);
        }

        try {
            console.log(`Loading SVG: ${this.baseUrl}${filename}`);
            const response = await fetch(this.baseUrl + filename, {
                method: 'GET',
                headers: {
                    'Accept': 'image/svg+xml,*/*'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load ${filename}`);
            }
            
            const svgContent = await response.text();
            console.log(`Successfully loaded ${filename}, content length: ${svgContent.length}`);
            
            this.loadedSVGs.set(filename, svgContent);
            return svgContent;
        } catch (error) {
            console.error(`Error loading SVG ${filename}:`, error);
            return null;
        }
    }

    // Get body parts for current view with proper Z-index ordering
    getBodyPartsForView(view) {
        const prefix = view === 'front' ? 'front-body-flesh-' : 'back-body-flesh-';
        
        // Return body parts in proper layering order (bottom to top)
        return [
            // Layer 1 (Bottom) - Legs and feet
            { name: 'leftFoot', file: `${prefix}LeftFoot.svg`, zIndex: 1 },
            { name: 'rightFoot', file: `${prefix}RightFoot.svg`, zIndex: 1 },
            { name: 'leftLowerLeg', file: `${prefix}LeftLowerLeg.svg`, zIndex: 2 },
            { name: 'rightLowerLeg', file: `${prefix}RightLowerLeg.svg`, zIndex: 2 },
            { name: 'leftUpperLeg', file: `${prefix}LeftUpperLeg.svg`, zIndex: 3 },
            { name: 'rightUpperLeg', file: `${prefix}RightUpperLeg.svg`, zIndex: 3 },
            
            // Layer 2 - Core body (middle)
            { name: 'coreBody', file: `${prefix}CoreBody.svg`, zIndex: 4 },
            
            // Layer 3 - Arms behind body
            { name: 'leftUpperArm', file: `${prefix}LeftUpperArm.svg`, zIndex: 3 },
            { name: 'leftLowerArm', file: `${prefix}LeftLowerArm.svg`, zIndex: 3 },
            { name: 'leftHand', file: `${prefix}LeftHand.svg`, zIndex: 3 },
            
            // Layer 4 - Arms in front of body
            { name: 'rightUpperArm', file: `${prefix}RightUpperArm.svg`, zIndex: 5 },
            { name: 'rightLowerArm', file: `${prefix}RightLowerArm.svg`, zIndex: 5 },
            { name: 'rightHand', file: `${prefix}RightHand.svg`, zIndex: 5 },
            
            // Layer 5 (Top) - Head
            { name: 'head', file: `${prefix}Head.svg`, zIndex: 6 }
        ];
    }

    // Render complete avatar with proper layering and original colors
    async renderAvatar(container, view = 'front') {
        if (this.isLoading) {
            console.log('Avatar is already loading, skipping...');
            return;
        }

        this.isLoading = true;
        this.currentView = view;
        const bodyParts = this.getBodyPartsForView(view);
        
        console.log(`Starting to render avatar in ${view} view`);
        console.log('Body parts to load:', bodyParts.map(p => p.file));
        
        // Show loading with progress
        container.innerHTML = `
            <div class="avatar-loading">
                <p>Loading your ${view} avatar...</p>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                </div>
                <p class="loading-status">Preparing...</p>
            </div>
        `;

        try {
            const loadingStatus = container.querySelector('.loading-status');
            const progressBar = container.querySelector('.progress-bar');
            
            // Load all SVG files
            loadingStatus.textContent = 'Loading body parts...';
            const svgPromises = bodyParts.map(async (part, index) => {
                const svgContent = await this.loadSVG(part.file);
                const progress = ((index + 1) / bodyParts.length) * 100;
                progressBar.style.width = `${progress}%`;
                loadingStatus.textContent = `Loading ${part.file}... (${index + 1}/${bodyParts.length})`;
                return { ...part, content: svgContent };
            });

            const svgResults = await Promise.all(svgPromises);
            console.log('All SVG files loaded:', svgResults.length);

            loadingStatus.textContent = 'Assembling avatar...';

            // Create the avatar display with proper layering
            const avatarDisplay = document.createElement('div');
            avatarDisplay.className = 'avatar-display';
            
            let successfulLoads = 0;
            
            // Sort by Z-index to ensure proper layering
            svgResults.sort((a, b) => a.zIndex - b.zIndex);
            
            // Process each SVG with proper layering
            for (const part of svgResults) {
                if (part.content && part.content.trim()) {
                    try {
                        // Create a container for this body part
                        const partContainer = document.createElement('div');
                        partContainer.className = `body-part-container ${part.name}`;
                        partContainer.innerHTML = part.content;
                        
                        // Style the container with proper Z-index
                        partContainer.style.position = 'absolute';
                        partContainer.style.top = '0';
                        partContainer.style.left = '0';
                        partContainer.style.width = '100%';
                        partContainer.style.height = '100%';
                        partContainer.style.zIndex = part.zIndex;
                        partContainer.style.pointerEvents = 'none';
                        
                        // Style the SVG to preserve original colors
                        const svgElement = partContainer.querySelector('svg');
                        if (svgElement) {
                            svgElement.style.position = 'absolute';
                            svgElement.style.top = '0';
                            svgElement.style.left = '0';
                            svgElement.style.width = '100%';
                            svgElement.style.height = '100%';
                            svgElement.style.objectFit = 'contain';
                            
                            // Preserve original SVG colors - don't override them
                            svgElement.style.color = 'inherit';
                        }
                        
                        avatarDisplay.appendChild(partContainer);
                        successfulLoads++;
                        console.log(`Successfully added ${part.file} to avatar with z-index ${part.zIndex}`);
                    } catch (error) {
                        console.error(`Error processing ${part.file}:`, error);
                    }
                } else {
                    console.warn(`No content for ${part.file}`);
                }
            }

            console.log(`Successfully loaded ${successfulLoads} out of ${bodyParts.length} body parts`);

            if (successfulLoads > 0) {
                // Replace loading with avatar
                container.innerHTML = '';
                container.appendChild(avatarDisplay);
                
                // DO NOT apply color customizations - preserve original SVG colors
                console.log('Avatar rendering completed successfully with original colors');
            } else {
                throw new Error('No body parts could be loaded');
            }
            
        } catch (error) {
            console.error('Error rendering avatar:', error);
            container.innerHTML = `
                <div class="avatar-error">
                    <p>❌ Error loading avatar</p>
                    <p>Could not load body template from GitHub</p>
                    <p class="error-details">${error.message}</p>
                    <button onclick="avatarRenderer.renderAvatar(document.getElementById('avatar-container'), '${view}')" class="btn-secondary" style="margin-top: 15px;">Try Again</button>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    // Switch between front and back view
    async switchView(container, view) {
        if (this.currentView === view || this.isLoading) return;
        
        console.log(`Switching to ${view} view`);
        await this.renderAvatar(container, view);
    }
}

// Global avatar renderer instance
const avatarRenderer = new AvatarRenderer();

// Avatar utility functions
function initializeAvatar() {
    const container = document.getElementById('avatar-container');
    if (!container) {
        console.error('Avatar container not found');
        return;
    }

    const user = getCurrentUser();
    if (!user) {
        console.error('No current user found');
        container.innerHTML = `
            <div class="avatar-error">
                <p>❌ No user logged in</p>
                <p>Please log in to view your avatar</p>
            </div>
        `;
        return;
    }

    console.log('Initializing avatar for user:', user.username);
    
    // Render the avatar
    avatarRenderer.renderAvatar(container, user.avatar.view || 'front');
}

function switchAvatarView(view) {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    console.log(`Switching avatar view to: ${view}`);

    // Update user preference
    const user = getCurrentUser();
    if (user) {
        user.avatar.view = view;
        updateCurrentUser(user);
    }

    // Render new view
    avatarRenderer.switchView(container, view);
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`${view}-view`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AvatarRenderer, avatarRenderer };
}