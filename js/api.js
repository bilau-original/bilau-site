// API Client para comunicação com o backend
// Configurações da API
const API_CONFIG = {
    BASE_URL: 'https://bilau-backend.onrender.com/api',
    // Para desenvolvimento local, descomente a linha abaixo:
    // BASE_URL: 'http://localhost:3000/api'
};

const API = {
    baseURL: API_CONFIG.BASE_URL,
    timeout: 30000, // 30 segundos
    retries: 3,

    // Fazer requisição HTTP com retry e tratamento de erros
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: this.timeout,
            ...options
        };

        let lastError;
        
        for (let attempt = 1; attempt <= this.retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(url, {
                    ...defaultOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                }

                return await response.text();

            } catch (error) {
                lastError = error;
                
                if (error.name === 'AbortError') {
                    lastError = new Error('Timeout: Requisição demorou muito para responder');
                }

                console.warn(`Tentativa ${attempt}/${this.retries} falhou:`, error.message);

                if (attempt === this.retries) {
                    break;
                }

                // Wait before retry (exponential backoff)
                await this.delay(Math.pow(2, attempt) * 1000);
            }
        }

        throw lastError;
    },

    // Utilitário para delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // =================== BILAU ENDPOINTS ===================

    // Obter estatísticas do Bilau
    async getBilauStats() {
        try {
            const stats = await this.get('/bilau/stats');
            return {
                currentSize: stats.totalCentimeters || 1652,
                totalDonations: stats.totalDonations || 0,
                totalAmount: stats.totalAmount || 0,
                currentVisual: stats.currentVisual || 'default',
                lastUpdated: stats.lastUpdated || new Date().toISOString(),
                ...stats
            };
        } catch (error) {
            console.error('Erro ao buscar stats do bilau:', error);
            // Retornar dados padrão se API falhar
            return {
                currentSize: 1652,
                totalDonations: 0,
                totalAmount: 0,
                currentVisual: 'default',
                lastUpdated: new Date().toISOString()
            };
        }
    },

    // Atualizar visual do Bilau
    async updateBilauVisual(visual) {
        try {
            return await this.put('/bilau/visual', { visual });
        } catch (error) {
            console.error('Erro ao atualizar visual:', error);
            throw new Error('Falha ao atualizar visual do Bilau');
        }
    },

    // =================== DONATIONS ENDPOINTS ===================

    // Obter todas as doações
    async getDonations(limit = 100, offset = 0) {
        try {
            const response = await this.get(`/donations?limit=${limit}&offset=${offset}`);
            return response.donations || response || [];
        } catch (error) {
            console.error('Erro ao buscar doações:', error);
            // Retornar dados mockados para desenvolvimento
            return this.getMockDonations();
        }
    },

    // Criar nova doação
    async createDonation(donationData) {
        try {
            const data = {
                name: donationData.name.trim(),
                amount: parseFloat(donationData.amount),
                centimeters: Math.round(parseFloat(donationData.amount)),
                cardType: this.getCardType(donationData.amount),
                customDesign: donationData.customDesign || null,
                email: donationData.email || null,
                timestamp: new Date().toISOString()
            };
    
            const response = await this.post('/donations', data);
            
            return {
                donationId: response.donation.id || response.donation._id,
                pixId: response.payment.pixId, // Acessar aninhado
                externalReference: response.payment.externalReference,
                pixCode: response.payment.qrCode, // Ajustar para qrCode
                qrCodeBase64: response.payment.qrCodeBase64,
                qrCodeUrl: response.payment.ticketUrl,
                expiresAt: response.payment.expiresAt,
                ...response
            };
        } catch (error) {
            console.error('Erro ao criar doação:', error);
            throw new Error('Falha ao processar doação. Tente novamente.');
        }
    },

    // Obter doação por ID
    async getDonation(donationId) {
        try {
            return await this.get(`/donations/${donationId}`);
        } catch (error) {
            console.error('Erro ao buscar doação:', error);
            throw new Error('Doação não encontrada');
        }
    },

    // =================== PAYMENT ENDPOINTS ===================

    // Verificar status do pagamento
    async checkPaymentStatus(pixId) {
        try {
            const response = await this.get(`/payments/status/pix/${pixId}`);  // Ajuste endpoint
            
            return {
                confirmed: response.confirmed || response.status === 'confirmed',
                expired: response.expired || response.status === 'expired',
                pending: response.pending || response.status === 'pending',
                donation: response.donation,
                paidAt: response.paidAt,
                ...response
            };

        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
            // Não fazer throw aqui para não quebrar a verificação periódica
            return { 
                confirmed: false, 
                expired: false, 
                pending: true,
                error: error.message 
            };
        }
    },

    async getDonationByPixId(pixId) {
        try {
            const response = await this.get(`/donations?pixId=${pixId}`); // Ajuste o endpoint conforme backend
            return response.donation;
        } catch (error) {
            throw new Error(`HTTP ${error.status}: ${error.message}`);
        }
    },
    
    // Confirmar pagamento (webhook simulation)
    async confirmPayment(donationId, paymentData) {
        try {
            return await this.post(`/payments/confirm/${donationId}`, paymentData);
        } catch (error) {
            console.error('Erro ao confirmar pagamento:', error);
            throw new Error('Falha ao confirmar pagamento');
        }
    },

    // Gerar novo PIX para doação existente
    async generateNewPix(donationId) {
        try {
            return await this.post(`/payments/regenerate/${donationId}`);
        } catch (error) {
            console.error('Erro ao gerar novo PIX:', error);
            throw new Error('Falha ao gerar novo código PIX');
        }
    },

    // =================== UTILITY METHODS ===================

    // Determinar tipo de card baseado no valor
    getCardType(amount) {
        const value = parseFloat(amount);
        if (value >= 200) return 'custom';
        if (value >= 50) return 'red';
        if (value >= 10) return 'yellow';
        return 'green';
    },

    // Dados mockados para desenvolvimento/fallback
    getMockDonations() {
        const mockNames = [
            'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
            'Carlos Souza', 'Fernanda Lima', 'Roberto Alves', 'Juliana Pereira',
            'Marcos Rodrigues', 'Lucia Fernandes', 'Diego Martins', 'Camila Rocha',
            'Bruno Castro', 'Vanessa Ribeiro', 'Thiago Nascimento', 'Amanda Torres'
        ];

        const donations = [];
        
        // Gerar algumas doações mockadas
        for (let i = 0; i < 12; i++) {
            const amount = [
                1, 2, 5, 8, 10, 15, 25, 50, 75, 100, 200, 500
            ][Math.floor(Math.random() * 12)];
            
            donations.push({
                id: `mock_${i}`,
                name: mockNames[i % mockNames.length],
                amount: amount,
                centimeters: amount,
                cardType: this.getCardType(amount),
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                confirmed: true
            });
        }

        // Ordenar por valor (maior para menor)
        return donations.sort((a, b) => b.amount - a.amount);
    },

    // Verificar se API está online
    async healthCheck() {
        try {
            const response = await this.get('/health');
            return response.status.toLowerCase === 'ok';
        } catch (error) {
            console.warn('API health check failed:', error.message);
            return false;
        }
    },

    // Obter configurações da aplicação
    async getConfig() {
        try {
            return await this.get('/config');
        } catch (error) {
            console.error('Erro ao buscar configurações:', error);
            return {
                goals: {
                    aquatico: 500,
                    cowboy: 1000,
                    ballz: 1500,
                    saiyajin: 2000
                },
                limits: {
                    minDonation: 1,
                    maxDonation: 10000,
                    customCardThreshold: 200
                }
            };
        }
    },

    // =================== ERROR HANDLING ===================

    // Tratar erros da API
    handleApiError(error) {
        if (error.name === 'AbortError') {
            return 'Conexão muito lenta. Verifique sua internet.';
        }
        
        if (error.message.includes('HTTP 400')) {
            return 'Dados inválidos. Verifique as informações.';
        }
        
        if (error.message.includes('HTTP 401')) {
            return 'Acesso não autorizado.';
        }
        
        if (error.message.includes('HTTP 404')) {
            return 'Recurso não encontrado.';
        }
        
        if (error.message.includes('HTTP 429')) {
            return 'Muitas tentativas. Tente novamente em alguns minutos.';
        }
        
        if (error.message.includes('HTTP 5')) {
            return 'Erro no servidor. Tente novamente mais tarde.';
        }
        
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError')) {
            return 'Erro de conexão. Verifique sua internet.';
        }
        
        return error.message || 'Erro desconhecido. Tente novamente.';
    }
};

// Event listeners para monitoramento da API
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar se API está online
    const isOnline = await API.healthCheck();
    
    if (!isOnline) {
        console.warn('API offline - usando dados mockados');
        Toast.warning('Modo offline - algumas funcionalidades limitadas', 5000);
    } else {
        console.log('API online e funcionando');
    }
});

// Interceptar erros não tratados para logging
window.addEventListener('unhandledrejection', event => {
    if (event.reason && event.reason.message) {
        const errorMsg = API.handleApiError(event.reason);
        console.error('Erro não tratado na API:', errorMsg);
        
        // Não mostrar toast para erros de verificação de pagamento
        if (!event.reason.message.includes('payments/status')) {
            Toast.error(errorMsg);
        }
    }
});

// Verificar conexão periodicamente
setInterval(async () => {
    const isOnline = await API.healthCheck();
    
    if (!isOnline && navigator.onLine) {
        console.warn('API offline mas navegador online');
    }
}, 5 * 60 * 1000); // A cada 5 minutos