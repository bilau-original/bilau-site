// Gerenciador de Pagamentos
const Payment = {
    currentPayment: null,
    checkInterval: null,
    maxRetries: 60, // 30 minutos (30s cada check)
    retryCount: 0,

    init() {
        this.setupEventListeners();
        console.log('Payment manager inicializado');
    },

    setupEventListeners() {
        // Botão para gerar novo PIX (se necessário)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('retry-payment-btn')) {
                this.retryPayment();
            }
        });
    },

    // Mostrar QR Code do PIX
    async showQRCode(pixData, amount, donationId, pixId) {
        try {
            this.currentPayment = {
                pixCode: pixData,
                amount: amount,
                pixId: pixId,
                donationId: donationId,
                timestamp: Date.now()
            };

            // Mostrar modal de QR
            Modal.showQRModal({
                pixCode: pixData,
                amount: amount
            });

            // Adicionar à lista de pagamentos pendentes
            this.addPendingPayment(donationId);

            // Iniciar verificação de status
            this.startPaymentCheck(donationId);

            // Auto-timeout após 30 minutos
            setTimeout(() => {
                if (this.currentPayment && this.currentPayment.donationId === donationId) {
                    this.handlePaymentTimeout();
                }
            }, 30 * 60 * 1000); // 30 minutos

        } catch (error) {
            console.error('Erro ao mostrar QR Code:', error);
            Toast.error('Erro ao gerar código de pagamento');
        }
    },

    // Gerar QR Code visual usando biblioteca externa
    async generateQRCodeImage(pixCode) {
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = '';

        try {
            // Se tiver acesso à biblioteca QR Code (adicionar via CDN no HTML)
            if (typeof QRCode !== 'undefined') {
                new QRCode(qrContainer, {
                    text: pixCode,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
            } else {
                // Fallback: usar serviço online para gerar QR
                const qrImage = document.createElement('img');
                qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`;
                qrImage.alt = 'QR Code PIX';
                qrImage.style.maxWidth = '100%';
                qrImage.onerror = () => this.showQRCodeFallback();
                qrContainer.appendChild(qrImage);
            }
        } catch (error) {
            console.error('Erro ao gerar QR Code:', error);
            this.showQRCodeFallback();
        }
    },

    // Fallback se não conseguir gerar QR Code
    showQRCodeFallback() {
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = `
            <div style="
                width: 200px; 
                height: 200px; 
                background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
                border: 2px solid #ddd;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: #666;
                font-size: 14px;
                padding: 20px;
                box-sizing: border-box;
            ">
                <div style="font-size: 40px; margin-bottom: 15px;">📱</div>
                <div style="font-weight: 600; margin-bottom: 10px;">PIX Copia e Cola</div>
                <div style="font-size: 12px; line-height: 1.4;">
                    Use o código abaixo para fazer o pagamento pelo seu banco
                </div>
            </div>
        `;
    },

    // Adicionar pagamento à lista de pendentes
    addPendingPayment(donationId) {
        try {
            const pending = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
            if (!pending.includes(donationId)) {
                pending.push(donationId);
                localStorage.setItem('pendingPayments', JSON.stringify(pending));
            }
        } catch (error) {
            console.error('Erro ao salvar pagamento pendente:', error);
        }
    },

    // Remover pagamento da lista de pendentes
    removePendingPayment(donationId) {
        try {
            const pending = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
            const filtered = pending.filter(id => id !== donationId);
            localStorage.setItem('pendingPayments', JSON.stringify(filtered));
        } catch (error) {
            console.error('Erro ao remover pagamento pendente:', error);
        }
    },

    // Iniciar verificação de status do pagamento
    startPaymentCheck(pixId) {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        this.retryCount = 0;
        
        this.checkInterval = setInterval(async () => {
            try {
                const status = await API.checkPaymentStatus(pixId);
                
                if (status.confirmed) {
                    this.handlePaymentSuccess(status);
                } else if (status.expired) {
                    this.handlePaymentExpired();
                } else {
                    this.retryCount++;
                    if (this.retryCount >= this.maxRetries) {
                        this.handlePaymentTimeout();
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar pagamento:', error);
                this.retryCount++;
                
                if (this.retryCount >= this.maxRetries) {
                    this.handlePaymentTimeout();
                }
            }
        }, 30000); // Verificar a cada 30 segundos
    },

    // Parar verificação de pagamento
    stopPaymentCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    },

    // Pagamento confirmado com sucesso
    handlePaymentSuccess(paymentData) {
        this.stopPaymentCheck();
        
        if (this.currentPayment) {
            this.removePendingPayment(this.currentPayment.pixId);
        }

        // Fechar modal de QR
        Modal.hide('qr-modal');

        // Atualizar dados do bilau
        if (paymentData.donation) {
            const donation = paymentData.donation;
            
            // Adicionar card do doador
            CardsManager.addCard(donation);
            
            // Atualizar tamanho do bilau
            const newSize = AppState.currentSize + donation.centimeters;
            BilauManager.updateSize(newSize);
            
            // Mostrar confirmação
            Modal.showPaymentConfirmed({
                amount: donation.amount,
                centimeters: donation.centimeters,
                isCustom: donation.amount >= 200,
                email: donation.email
            });
            
            Toast.success(`🎉 Pagamento confirmado! Obrigado ${donation.name}!`, 5000);
        }

        this.currentPayment = null;
    },

    // Pagamento expirado
    handlePaymentExpired() {
        this.stopPaymentCheck();
        
        Toast.warning('Tempo para pagamento expirado. Gere um novo código PIX.', 8000);
        
        // Adicionar botão para tentar novamente
        const retryButton = document.createElement('button');
        retryButton.className = 'retry-payment-btn';
        retryButton.textContent = 'Gerar novo PIX';
        retryButton.style.cssText = `
            margin-top: 15px;
            background: #FF6B35;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        `;
        
        const qrModal = document.getElementById('qr-modal');
        const qrContent = qrModal.querySelector('.qr-content');
        qrContent.appendChild(retryButton);
    },

    // Timeout de pagamento (30 minutos)
    handlePaymentTimeout() {
        this.stopPaymentCheck();
        
        Toast.error('Tempo limite para pagamento atingido. Tente novamente.', 8000);
        
        // Fechar modal automaticamente após 3 segundos
        setTimeout(() => {
            Modal.hide('qr-modal');
        }, 3000);

        this.currentPayment = null;
    },

    // Tentar pagamento novamente
    async retryPayment() {
        if (!this.currentPayment) {
            Toast.error('Nenhum pagamento ativo para tentar novamente');
            return;
        }

        try {
            // Fechar modal atual
            Modal.hide('qr-modal');
            
            // Mostrar modal de doação novamente com dados preenchidos
            const donation = this.currentPayment;
            Modal.showDonationModal({
                amount: donation.amount
            });
            
            Toast.info('Preencha os dados novamente para gerar novo PIX');
            
        } catch (error) {
            console.error('Erro ao tentar pagamento novamente:', error);
            Toast.error('Erro ao processar nova tentativa');
        }
    },

    // Verificar se há pagamentos pendentes ao carregar página
    async checkPendingPaymentsOnLoad() {
        try {
            const pending = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
            
            for (const donationId of pending) {
                const status = await API.checkPaymentStatus(donationId);
                
                if (status.confirmed) {
                    this.removePendingPayment(donationId);
                    
                    // Notificar usuário sobre pagamento confirmado
                    if (status.donation) {
                        Toast.success(`Pagamento confirmado para ${status.donation.name}! 🎉`, 5000);
                        
                        // Atualizar interface
                        CardsManager.addCard(status.donation);
                        const newSize = AppState.currentSize + status.donation.centimeters;
                        BilauManager.updateSize(newSize);
                    }
                } else if (status.expired) {
                    this.removePendingPayment(donationId);
                }
            }
        } catch (error) {
            console.error('Erro ao verificar pagamentos pendentes:', error);
        }
    },

    // Obter informações do pagamento atual
    getCurrentPayment() {
        return this.currentPayment;
    },

    // Limpar dados de pagamento
    clearPayment() {
        this.stopPaymentCheck();
        this.currentPayment = null;
        this.retryCount = 0;
    },

    // Validar se PIX é válido
    validatePixCode(pixCode) {
        if (!pixCode || typeof pixCode !== 'string') {
            return false;
        }

        // PIX codes geralmente têm pelo menos 32 caracteres
        if (pixCode.length < 32) {
            return false;
        }

        // Deve conter apenas caracteres alfanuméricos e alguns símbolos específicos
        const validChars = /^[A-Za-z0-9+/=.-]+$/;
        return validChars.test(pixCode);
    },

    // Formatar valor monetário
    formatAmount(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    },

    // Calcular centímetros baseado no valor
    calculateCentimeters(amount) {
        return Math.round(amount); // R$ 1,00 = 1 cm
    }
};

// Event listeners para funcionalidades de pagamento
document.addEventListener('DOMContentLoaded', () => {
    
    // Verificar pagamentos pendentes ao carregar
    Payment.checkPendingPaymentsOnLoad();
    
    // Integração com MercadoPago (se disponível)
    if (typeof MercadoPago !== 'undefined') {
        console.log('MercadoPago SDK detectado');
        // Configurar MercadoPago se necessário
    }
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    Payment.clearPayment();
});

// Adicionar CSS específico para elementos de pagamento
const paymentCSS = `
.retry-payment-btn:hover {
    background: #e55a2b !important;
    transform: translateY(-2px);
    transition: all 0.3s ease;
}

.payment-status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
    font-weight: 600;
}

.payment-status.success {
    background: rgba(76, 175, 80, 0.1);
    color: #2e7d32;
    border: 1px solid rgba(76, 175, 80, 0.3);
}

.payment-status.pending {
    background: rgba(255, 152, 0, 0.1);
    color: #f57c00;
    border: 1px solid rgba(255, 152, 0, 0.3);
}

.payment-status.error {
    background: rgba(244, 67, 54, 0.1);
    color: #c62828;
    border: 1px solid rgba(244, 67, 54, 0.3);
}

.pix-instructions {
    background: rgba(102, 126, 234, 0.05);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 10px;
    padding: 15px;
    margin: 15px 0;
    font-size: 0.9em;
    line-height: 1.5;
}

.pix-instructions h4 {
    color: #667eea;
    margin-bottom: 10px;
    font-size: 1em;
}

.pix-instructions ol {
    margin: 10px 0;
    padding-left: 20px;
}

.pix-instructions li {
    margin-bottom: 5px;
}

.qr-code-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    background: #f8f9fa;
    border: 2px dashed #dee2e6;
    border-radius: 10px;
    color: #6c757d;
    font-size: 14px;
}

.qr-code-loading .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #e9ecef;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

const paymentStyle = document.createElement('style');
paymentStyle.textContent = paymentCSS;
document.head.appendChild(paymentStyle);