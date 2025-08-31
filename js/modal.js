// Gerenciador de Modais
const Modal = {
    modals: new Map(),
    currentModal: null,
    backdrop: null,

    init() {
        // Registrar todos os modais
        this.registerModal('donation-modal');
        this.registerModal('payment-modal');
        this.registerModal('qr-modal');

        // Event listeners globais
        this.setupGlobalListeners();
        
        console.log('Modal manager inicializado');
    },

    registerModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal ${modalId} não encontrado`);
            return;
        }

        this.modals.set(modalId, {
            element: modal,
            isOpen: false,
            closeOnBackdrop: true,
            closeOnEsc: true,
            onShow: null,
            onHide: null,
            onBeforeShow: null,
            onBeforeHide: null
        });

        // Event listeners específicos do modal
        this.setupModalListeners(modalId);
    },

    setupModalListeners(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        const modal = modalData.element;

        // Botões de fechar
        const closeButtons = modal.querySelectorAll('.close-btn, [data-close]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hide(modalId);
            });
        });

        // Clique no backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal && modalData.closeOnBackdrop) {
                this.hide(modalId);
            }
        });

        // Prevenir fechamento ao clicar no conteúdo
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    },

    setupGlobalListeners() {
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                const modalData = this.modals.get(this.currentModal);
                if (modalData && modalData.closeOnEsc) {
                    this.hide(this.currentModal);
                }
            }
        });

        // Prevenir scroll do body quando modal estiver aberto
        document.addEventListener('modal:show', () => {
            document.body.style.overflow = 'hidden';
        });

        document.addEventListener('modal:hide', () => {
            if (!this.currentModal) {
                document.body.style.overflow = '';
            }
        });
    },

    show(modalId, options = {}) {
        const modalData = this.modals.get(modalId);
        if (!modalData) {
            console.error(`Modal ${modalId} não encontrado`);
            return false;
        }

        if (modalData.isOpen) {
            console.warn(`Modal ${modalId} já está aberto`);
            return false;
        }

        // Callback antes de mostrar
        if (modalData.onBeforeShow) {
            const canShow = modalData.onBeforeShow(options);
            if (canShow === false) return false;
        }

        // Fechar modal atual se houver
        if (this.currentModal && this.currentModal !== modalId) {
            this.hide(this.currentModal);
        }

        // Mostrar modal
        modalData.element.classList.add('show');
        modalData.element.style.display = 'flex';
        modalData.isOpen = true;
        this.currentModal = modalId;

        // Focar no primeiro elemento focável
        this.focusFirstElement(modalData.element);

        // Dispatch event
        document.dispatchEvent(new CustomEvent('modal:show', {
            detail: { modalId, options }
        }));

        // Callback após mostrar
        if (modalData.onShow) {
            setTimeout(() => modalData.onShow(options), 100);
        }

        console.log(`Modal ${modalId} aberto`);
        return true;
    },


    hide(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) {
            console.error(`Modal ${modalId} não encontrado`);
            return false;
        }
    
        if (!modalData.isOpen) {
            console.warn(`Modal ${modalId} já está fechado`);
            return false;
        }
    
        if (modalId === 'qr-modal' && this.paymentCheckInterval) {
            clearInterval(this.paymentCheckInterval);
            this.paymentCheckInterval = null;
        }

        // Callback antes de esconder
        if (modalData.onBeforeHide) {
            const canHide = modalData.onBeforeHide();
            if (canHide === false) return false;
        }

        // Esconder modal
        modalData.element.classList.remove('show');
        
        // Aguardar animação antes de esconder
        setTimeout(() => {
            modalData.element.style.display = 'none';
            modalData.isOpen = false;
            
            if (this.currentModal === modalId) {
                this.currentModal = null;
            }

            // Dispatch event
            document.dispatchEvent(new CustomEvent('modal:hide', {
                detail: { modalId }
            }));

            // Callback após esconder
            if (modalData.onHide) {
                modalData.onHide();
            }

        }, 300); // Tempo da animação CSS

        console.log(`Modal ${modalId} fechado`);
        return true;
    },

    hideAll() {
        this.modals.forEach((modalData, modalId) => {
            if (modalData.isOpen) {
                this.hide(modalId);
            }
        });
    },

    toggle(modalId, options = {}) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return false;

        return modalData.isOpen ? this.hide(modalId) : this.show(modalId, options);
    },

    isOpen(modalId) {
        const modalData = this.modals.get(modalId);
        return modalData ? modalData.isOpen : false;
    },

    getCurrentModal() {
        return this.currentModal;
    },

    setOptions(modalId, options) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return false;

        Object.assign(modalData, options);
        return true;
    },

    focusFirstElement(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    },

    // Métodos utilitários para modais específicos

    // Modal de doação
    showDonationModal(prefillData = {}) {
        this.show('donation-modal');
        
        // Preencher campos se fornecidos
        if (prefillData.name) {
            document.getElementById('donor-name').value = prefillData.name;
        }
        if (prefillData.amount) {
            document.getElementById('donation-amount').value = prefillData.amount;
        }
        if (prefillData.email) {
            document.getElementById('donor-email').value = prefillData.email;
        }
    },

    // Modal de pagamento confirmado
    showPaymentConfirmed(donationData = {}) {
        this.show('payment-modal');
        
        // Atualizar conteúdo se necessário
        const content = document.querySelector('#payment-modal .payment-info');
        if (donationData.isCustom) {
            content.innerHTML = `
                <p>Obrigado pela sua doação premium de ${Utils.formatCurrency(donationData.amount)}!</p>
                <p>Seu card customizado será criado e enviado para <strong>${donationData.email}</strong> em até 2 dias úteis.</p>
                <p>O Bilau cresceu ${donationData.centimeters} cm graças a você! 🎉</p>
            `;
        } else {
            content.innerHTML = `
                <p>Obrigado pela sua doação de ${Utils.formatCurrency(donationData.amount)}!</p>
                <p>O Bilau cresceu ${donationData.centimeters} cm graças a você! 🎉</p>
                <p>Seu card já aparece na galeria de doadores.</p>
            `;
        }
    },

    // Modal de QR Code
    showQRModal(qrData) {
        this.show('qr-modal');
        
        // Atualizar valor
        document.getElementById('payment-amount').textContent = 
            Utils.formatCurrency(qrData.amount).replace('R$ ', '');
        
        // Definir código PIX
        const pixInput = document.getElementById('pix-code-input');
        pixInput.value = qrData.pixCode || qrData.qrCode; // Fallback para qrCode se pixCode não existir
        
        // Gerar QR Code usando qrCodeBase64
        this.generateQRCode(qrData.qrCodeBase64, qrData.pixId); // Passe pixId para iniciar polling
    },

    generateQRCode(qrCodeBase64, pixId) {
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = ''; // Limpar conteúdo anterior
        
        if (qrCodeBase64) {
            // Criar imagem a partir do base64
            const qrImage = document.createElement('img');
            qrImage.src = `data:image/png;base64,${qrCodeBase64}`;
            qrImage.style.cssText = `
                width: 200px;
                height: 200px;
                border: 2px solid #ddd;
                border-radius: 10px;
            `;
            qrContainer.appendChild(qrImage);
        } else {
            // Fallback placeholder
            const qrPlaceholder = document.createElement('div');
            qrPlaceholder.style.cssText = `
                width: 200px;
                height: 200px;
                background: #f0f0f0;
                border: 2px solid #ddd;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: #666;
                text-align: center;
                border-radius: 10px;
            `;
            qrPlaceholder.innerHTML = `
                <div>
                    <div style="margin-bottom: 10px;">📱</div>
                    <div>QR Code do PIX</div>
                    <div style="font-size: 12px; margin-top: 5px;">Use o código abaixo para copiar e colar</div>
                </div>
            `;
            qrContainer.appendChild(qrPlaceholder);
        }
    
    },
};

// Event listeners para funcionalidades específicas dos modais
document.addEventListener('DOMContentLoaded', () => {
    
    // Copiar código PIX
    const copyPixBtn = document.getElementById('copy-pix');
    if (copyPixBtn) {
        copyPixBtn.addEventListener('click', async () => {
            const pixInput = document.getElementById('pix-code-input');
            
            try {
                await navigator.clipboard.writeText(pixInput.value);
                Toast.success('Código PIX copiado!');
                
                // Feedback visual
                copyPixBtn.textContent = 'Copiado!';
                copyPixBtn.style.background = '#4CAF50';
                
                setTimeout(() => {
                    copyPixBtn.textContent = 'Copiar';
                    copyPixBtn.style.background = '#667eea';
                }, 2000);
                
            } catch (error) {
                console.error('Erro ao copiar:', error);
                
                // Fallback para browsers mais antigos
                pixInput.select();
                pixInput.setSelectionRange(0, 99999);
                document.execCommand('copy');
                
                Toast.success('Código PIX copiado!');
            }
        });
    }

    // Botão de problemas para visualizar QR
    const problemsBtn = document.getElementById('payment-problems');
    if (problemsBtn) {
        problemsBtn.addEventListener('click', () => {
            const alternatives = `
                <div style="text-align: left; margin-top: 15px;">
                    <h4>Alternativas para pagamento:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Copie o código PIX e cole no seu banco</li>
                        <li>Use o aplicativo do seu banco para ler o QR</li>
                        <li>Abra o PIX no seu celular e digitalize</li>
                    </ul>
                    <p><small>Se continuar com problemas, tente recarregar a página.</small></p>
                </div>
            `;
            
            Toast.show(alternatives, 'warning', 8000);
        });
    }
});

// Adicionar animações CSS para os modais
const modalCSS = `
@keyframes toastOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.modal {
    animation: fadeIn 0.3s ease;
}

.modal.show .modal-content {
    animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
    from { 
        transform: scale(0.7) translateY(-50px); 
        opacity: 0; 
    }
    to { 
        transform: scale(1) translateY(0); 
        opacity: 1; 
    }
}

.modal:not(.show) .modal-content {
    animation: modalSlideOut 0.3s ease;
}

@keyframes modalSlideOut {
    from { 
        transform: scale(1) translateY(0); 
        opacity: 1; 
    }
    to { 
        transform: scale(0.7) translateY(-50px); 
        opacity: 0; 
    }
}
`;

// Injetar CSS
const modalStyle = document.createElement('style');
modalStyle.textContent = modalCSS;
document.head.appendChild(modalStyle);