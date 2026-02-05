import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Switch,
    Alert,
    FlatList,
    Modal,
    TextInput,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getAds, createAd, updateAd, deleteAd, getAdAnalytics } from '@/services/ads';
import { Ad, AdStats } from '@/types/ad';
import { colors, spacing, typography } from '@/utils/theme';
import { Card } from '@/components/ui/Card';

export default function AdManagementScreen() {
    const [activeTab, setActiveTab] = useState<'ads' | 'analytics'>('ads');
    const [ads, setAds] = useState<Ad[]>([]);
    const [stats, setStats] = useState<AdStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Ad | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        image_url: '',
        link: '',
        alt: '',
        variant: 'horizontal' as Ad['variant'],
        is_active: true,
        priority: '0',
    });

    const loadData = async () => {
        setLoading(true);
        const [adsData, statsData] = await Promise.all([getAds(), getAdAnalytics()]);
        setAds(adsData);
        setStats(statsData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleToggleActive = async (ad: Ad) => {
        const success = await updateAd(ad.id, { is_active: !ad.is_active });
        if (success) {
            setAds(prev => prev.map(a => a.id === ad.id ? { ...a, is_active: !a.is_active } : a));
        }
    };

    const handleSaveAd = async () => {
        if (!formData.image_url || !formData.alt) {
            Alert.alert('Erro', 'URL da imagem e texto alternativo são obrigatórios');
            return;
        }

        const adData = {
            image_url: formData.image_url,
            link: formData.link || null,
            alt: formData.alt,
            variant: formData.variant,
            is_active: formData.is_active,
            priority: parseInt(formData.priority) || 0,
            start_date: null,
            end_date: null,
        };

        if (editingAd) {
            const result = await updateAd(editingAd.id, adData);
            if (result.success) {
                Alert.alert('Sucesso', 'Anúncio atualizado');
                loadData();
                setIsModalOpen(false);
            }
        } else {
            const result = await createAd({ ...adData, created_by: null });
            if (result.success) {
                Alert.alert('Sucesso', 'Novo anúncio criado');
                loadData();
                setIsModalOpen(false);
            }
        }
    };

    const handleDeleteAd = (id: string) => {
        Alert.alert('Excluir', 'Tem certeza que deseja excluir este anúncio?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    const result = await deleteAd(id);
                    if (result.success) {
                        setAds(prev => prev.filter(a => a.id !== id));
                    }
                }
            }
        ]);
    };

    const openForm = (ad?: Ad) => {
        if (ad) {
            setEditingAd(ad);
            setFormData({
                image_url: ad.image_url,
                link: ad.link || '',
                alt: ad.alt,
                variant: ad.variant,
                is_active: ad.is_active,
                priority: ad.priority.toString(),
            });
        } else {
            setEditingAd(null);
            setFormData({
                image_url: '',
                link: '',
                alt: '',
                variant: 'horizontal',
                is_active: true,
                priority: '0',
            });
        }
        setIsModalOpen(true);
    };

    const renderAdItem = ({ item }: { item: Ad }) => {
        const adStats = stats.find(s => s.ad_id === item.id) || { views: 0, clicks: 0, ctr: 0 };
        return (
            <Card style={styles.adCard}>
                <View style={styles.adRow}>
                    <Image source={{ uri: item.image_url }} style={styles.adThumbnail} />
                    <View style={styles.adInfo}>
                        <Text style={styles.adTitle} numberOfLines={1}>{item.alt}</Text>
                        <Text style={styles.adVariant}>{item.variant.toUpperCase()}</Text>
                        <View style={styles.adStatsTiny}>
                            <View style={styles.statIconText}>
                                <Ionicons name="eye-outline" size={12} color={colors.mutedForeground} />
                                <Text style={styles.tinyStatText}>{adStats.views}</Text>
                            </View>
                            <View style={styles.statIconText}>
                                <MaterialIcons name="mouse" size={12} color={colors.mutedForeground} />
                                <Text style={styles.tinyStatText}>{adStats.clicks}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.adActions}>
                        <Switch
                            value={item.is_active}
                            onValueChange={() => handleToggleActive(item)}
                            trackColor={{ false: '#767577', true: colors.primary + '80' }}
                            thumbColor={item.is_active ? colors.primary : '#f4f3f4'}
                        />
                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity onPress={() => openForm(item)} style={styles.iconButton}>
                                <MaterialIcons name="edit" size={20} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteAd(item.id)} style={styles.iconButton}>
                                <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        );
    };

    const renderAnalytics = () => {
        const totalViews = stats.reduce((acc, s) => acc + s.views, 0);
        const totalClicks = stats.reduce((acc, s) => acc + s.clicks, 0);
        const avgCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

        return (
            <ScrollView style={styles.tabContent}>
                <View style={styles.statsGrid}>
                    <Card style={styles.statBox}>
                        <Text style={styles.statLabel}>Visualizações</Text>
                        <Text style={styles.statValue}>{totalViews.toLocaleString()}</Text>
                    </Card>
                    <Card style={styles.statBox}>
                        <Text style={styles.statLabel}>Cliques</Text>
                        <Text style={styles.statValue}>{totalClicks.toLocaleString()}</Text>
                    </Card>
                    <Card style={[styles.statBox, { width: '100%', marginTop: spacing.md }]}>
                        <Text style={styles.statLabel}>CTR Médio</Text>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{avgCTR.toFixed(2)}%</Text>
                    </Card>
                </View>

                <Text style={styles.sectionTitle}>Performance por Variante</Text>
                {['horizontal', 'vertical', 'inline', 'sticky-mobile'].map(v => {
                    const adsOfVariant = ads.filter(a => a.variant === v).map(a => a.id);
                    const vViews = stats.filter(s => adsOfVariant.includes(s.ad_id)).reduce((acc, s) => acc + s.views, 0);
                    return (
                        <View key={v} style={styles.variantStatItem}>
                            <Text style={styles.variantName}>{v.replace('-', ' ').toUpperCase()}</Text>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${(vViews / totalViews) * 100}%` }]} />
                            </View>
                            <Text style={styles.variantValue}>{vViews} views</Text>
                        </View>
                    );
                })}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'ads' && styles.activeTab]}
                    onPress={() => setActiveTab('ads')}
                >
                    <MaterialIcons name="image" size={20} color={activeTab === 'ads' ? colors.primary : colors.mutedForeground} />
                    <Text style={[styles.tabText, activeTab === 'ads' && styles.activeTabText]}>Anúncios</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
                    onPress={() => setActiveTab('analytics')}
                >
                    <MaterialIcons name="bar-chart" size={20} color={activeTab === 'analytics' ? colors.primary : colors.mutedForeground} />
                    <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Análises</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : activeTab === 'ads' ? (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={ads}
                        renderItem={renderAdItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum anúncio encontrado.</Text>}
                    />
                    <TouchableOpacity style={styles.fab} onPress={() => openForm()}>
                        <MaterialIcons name="add" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>
            ) : (
                renderAnalytics()
            )}

            {/* Ad Form Modal */}
            <Modal visible={isModalOpen} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingAd ? 'Editar Anúncio' : 'Novo Anúncio'}</Text>
                            <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                                <MaterialIcons name="close" size={24} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.form}>
                            <Text style={styles.label}>URL da Imagem *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.image_url}
                                onChangeText={text => setFormData({ ...formData, image_url: text })}
                                placeholder="https://exemplo.com/banner.jpg"
                            />

                            <Text style={styles.label}>Link de Destino</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.link}
                                onChangeText={text => setFormData({ ...formData, link: text })}
                                placeholder="https://seusite.com"
                            />

                            <Text style={styles.label}>Texto Alternativo (Alt) *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.alt}
                                onChangeText={text => setFormData({ ...formData, alt: text })}
                                placeholder="Ex: Promoção de Natal"
                            />

                            <Text style={styles.label}>Variante</Text>
                            <View style={styles.variantPicker}>
                                {['horizontal', 'vertical', 'inline', 'sticky-mobile'].map(v => (
                                    <TouchableOpacity
                                        key={v}
                                        style={[styles.variantChip, formData.variant === v && styles.variantChipSelected]}
                                        onPress={() => setFormData({ ...formData, variant: v as any })}
                                    >
                                        <Text style={[styles.variantChipText, formData.variant === v && styles.variantChipTextSelected]}>
                                            {v.split('-')[0]}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.label}>Prioridade</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.priority}
                                onChangeText={text => setFormData({ ...formData, priority: text })}
                                keyboardType="numeric"
                            />

                            <View style={styles.switchRow}>
                                <Text style={styles.label}>Ativo</Text>
                                <Switch
                                    value={formData.is_active}
                                    onValueChange={val => setFormData({ ...formData, is_active: val })}
                                />
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAd}>
                                <Text style={styles.saveButtonText}>Salvar Anúncio</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    tabText: {
        ...typography.label,
        color: colors.mutedForeground,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: spacing.md,
    },
    adCard: {
        marginBottom: spacing.md,
        padding: spacing.sm,
    },
    adRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    adThumbnail: {
        width: 60,
        height: 40,
        borderRadius: 4,
        backgroundColor: colors.card,
    },
    adInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    adTitle: {
        ...typography.h4,
        fontSize: 14,
    },
    adVariant: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 10,
    },
    adStatsTiny: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 2,
    },
    statIconText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    tinyStatText: {
        fontSize: 10,
        color: colors.mutedForeground,
    },
    adActions: {
        alignItems: 'flex-end',
        gap: 4,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 4,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    tabContent: {
        padding: spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statBox: {
        width: '48%',
        padding: spacing.md,
        alignItems: 'center',
    },
    statLabel: {
        ...typography.caption,
        color: colors.mutedForeground,
    },
    statValue: {
        ...typography.h3,
        fontSize: 20,
    },
    sectionTitle: {
        ...typography.h4,
        marginVertical: spacing.lg,
    },
    variantStatItem: {
        marginBottom: spacing.md,
    },
    variantName: {
        ...typography.label,
        fontSize: 12,
        marginBottom: 4,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: colors.card,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
    },
    variantValue: {
        ...typography.caption,
        textAlign: 'right',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: colors.mutedForeground,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '85%',
        padding: spacing.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    modalTitle: {
        ...typography.h3,
    },
    form: {
        gap: spacing.md,
        paddingBottom: 40,
    },
    label: {
        ...typography.label,
        color: colors.foreground,
        marginBottom: -8,
    },
    input: {
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.foreground,
    },
    variantPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    variantChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
    },
    variantChipSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    variantChipText: {
        fontSize: 12,
        color: colors.mutedForeground,
    },
    variantChipTextSelected: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
