// Avatar System for Metaverse Application

class AvatarRenderer {
    constructor() {
        this.baseUrl = 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/';
        this.currentView = 'front';
        this.loadedSVGs = new Map();
        this.isLoading = false;
    }

    // Load SVG content from GitHub
    async loadSVG(filename) {
        if (this.loadedSVGs.has(filename)) {
            return this.loadedSVGs.get(filename);
        }

        try {
            const response = await fetch(this.baseUrl + filename);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            const svgContent = await response.text();
            this.loadedSVGs.set(filename, svgContent);
            return svgContent;
        } catch (error) {
            console.error(`Error loading SVG ${filename}:`, error);
            return null;
        }
    }

    // Get body parts with CORRECT arm layering: RIGHT arm UNDER body, LEFT arm ON TOP
    getBodyPartsForView(view) {
        const prefix = view === 'front' ? 'front-body-flesh-' : 'back-body-flesh-';
        
        return [
            // Layer 1 - Feet
            { name: 'leftFoot', file: `${prefix}LeftFoot.svg`, zIndex: 1 },
            { name: 'rightFoot', file: `${prefix}RightFoot.svg`, zIndex: 1 },
            
            // Layer 2 - Lower legs
            { name: 'leftLowerLeg', file: `${prefix}LeftLowerLeg.svg`, zIndex: 2 },
            { name: 'rightLowerLeg', file: `${prefix}RightLowerLeg.svg`, zIndex: 2 },
            
            // Layer 3 - Upper legs + RIGHT ARM (UNDER body)
            { name: 'leftUpperLeg', file: `${prefix}LeftUpperLeg.svg`, zIndex: 3 },
            { name: 'rightUpperLeg', file: `${prefix}RightUpperLeg.svg`, zIndex: 3 },
            { name: 'rightUpperArm', file: `${prefix}RightUpperArm.svg`, zIndex: 3 },
            { name: 'rightLowerArm', file: `${prefix}RightLowerArm.svg`, zIndex: 3 },
            { name: 'rightHand', file: `${prefix}RightHand.svg`, zIndex: 3 },
            
            // Layer 4 - Core body
            { name: 'coreBody', file: `${prefix}CoreBody.svg`, zIndex: 4 },
            
            // Layer 5 - LEFT ARM (ON TOP of body)
            { name: 'leftUpperArm', file: `${prefix}LeftUpperArm.svg`, zIndex: 5 },
            { name: 'leftLowerArm', file: `${prefix}LeftLowerArm.svg`, zIndex: 5 },
            { name: 'leftHand', file: `${prefix}LeftHand.svg`, zIndex: 5 },
            
            // Layer 6 - Head
            { name: 'head', file: `${prefix}Head.svg`, zIndex: 6 }
        ];
    }

    // Render avatar with CONSISTENT SCALING for both views
    async renderAvatar(container, view = 'front') {
        if (this.isLoading) return;

        this.isLoading = true;
        this.currentView = view;
        const bodyParts = this.getBodyPartsForView(view);
        
        container.innerHTML = `<div class="avatar-loading"><p>Loading avatar...</p></div>`;

        try {
            const svgPromises = bodyParts.map(async (part) => {
                const svgContent = await this.loadSVG(part.file);
                return { ...part, content: svgContent };
            });

            const svgResults = await Promise.all(svgPromises);
            const avatarDisplay = document.createElement('div');
            avatarDisplay.className = 'avatar-display';
            
            // Sort by Z-index for proper layering
            svgResults.sort((a, b) => a.zIndex - b.zIndex);
            
            for (const part of svgResults) {
                if (part.content && part.content.trim()) {
                    const partContainer = document.createElement('div');
                    partContainer.className = `body-part-container ${part.name}`;
                    partContainer.innerHTML = part.content;
                    
                    partContainer.style.position = 'absolute';
                    partContainer.style.top = '0';
                    partContainer.style.left = '0';
                    partContainer.style.width = '100%';
                    partContainer.style.height = '100%';
                    partContainer.style.zIndex = part.zIndex;
                    partContainer.style.pointerEvents = 'none';
                    
                    const svgElement = partContainer.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.position = 'absolute';
                        svgElement.style.top = '0';
                        svgElement.style.left = '0';
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                        svgElement.style.objectFit = 'contain';
                        
                        // SAME SCALE FOR BOTH FRONT AND BACK VIEW
                        svgElement.style.transform = 'scale(0.85)';
                        svgElement.style.transformOrigin = 'center center';
                    }
                    
                    avatarDisplay.appendChild(partContainer);
                }
            }

            container.innerHTML = '';
            container.appendChild(avatarDisplay);
            
        } catch (error) {
            console.error('Error rendering avatar:', error);
            container.innerHTML = `<div class="avatar-error"><p>Error loading avatar</p></div>`;
        } finally {
            this.isLoading = false;
        }
    }

    async switchView(container, view) {
        if (this.currentView === view || this.isLoading) return;
        await this.renderAvatar(container, view);
    }
}

const avatarRenderer = new AvatarRenderer();

function initializeAvatar() {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    const user = getCurrentUser();
    if (!user) {
        container.innerHTML = `<div class="avatar-error"><p>No user logged in</p></div>`;
        return;
    }
    
    avatarRenderer.renderAvatar(container, user.avatar.view || 'front');
}

function switchAvatarView(view) {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    const user = getCurrentUser();
    if (user) {
        user.avatar.view = view;
        updateCurrentUser(user);
    }

    avatarRenderer.switchView(container, view);
    
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`${view}-view`);
    if (activeBtn) activeBtn.classList.add('active');
}