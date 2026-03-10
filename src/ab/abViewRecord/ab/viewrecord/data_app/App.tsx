const AppContainer = links.components.AppContainer();
const Window = links.components.Window();
const TextLink = links.components.TextLink();
const css = links.utils.abCompileCSS([ thisBot, links.components ]);

const { useState, useEffect, useCallback, useMemo } = os.appHooks;

function isAuthErrorMessage(msg) {
    return /not[_\s-]?authorized|missing[_\s-]?permission|permission[_\s-]?denied/i.test(msg || '');
}

function useRecordBrowser(recordName) {
    const [items, setItems] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [lastAddress, setLastAddress] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(false);
    const [loadingAll, setLoadingAll] = useState(false);
    const [granting, setGranting] = useState(false);
    const [error, setError] = useState(null);
    const [permNeeded, setPermNeeded] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [query, setQuery] = useState('');
    const [markerFilter, setMarkerFilter] = useState('');

    useEffect(() => {
        setItems([]);
        setTotalCount(null);
        setLastAddress(null);
        setHasMore(true);
        setLoading(false);
        setLoadingAll(false);
        setGranting(false);
        setError(null);
        setPermNeeded(false);
        setSelectedIndex(0);
        setQuery('');
        setMarkerFilter('');
    }, [recordName]);

    const applyPageResult = useCallback((result, prevLen) => {
        const newItems = result.items || [];
        setItems(prev => prev.concat(newItems));
        setTotalCount(result.totalCount ?? null);
        if (newItems.length > 0) {
            const nextLast = newItems[newItems.length - 1].address;
            setLastAddress(nextLast);
            if (result.totalCount != null && (prevLen + newItems.length) >= result.totalCount) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }
        setPermNeeded(false);
    }, []);

    const loadPage = useCallback(async () => {
        if (!recordName || loading || !hasMore) return;
        setLoading(true);
        setError(null);
        try {
            const result = await os.listData(recordName, lastAddress || null);
            if (result?.success) {
                applyPageResult(result, items.length);
            } else {
                const msg = result?.errorMessage || 'Failed to list data.';
                setError(msg);
                if (isAuthErrorMessage(msg)) setPermNeeded(true);
                setHasMore(false);
            }
        } catch (err) {
            const msg = err?.message ?? String(err);
            setError(msg);
            if (isAuthErrorMessage(msg)) setPermNeeded(true);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [recordName, lastAddress, loading, hasMore, items.length, applyPageResult]);

    const loadAll = useCallback(async () => {
        if (!recordName || loadingAll) return;
        setLoadingAll(true);
        setError(null);
        try {
            let cursor = lastAddress || null;
            let done = false;
            let accumulated = [];
            let pageCount = 0;
            const MAX_PAGES = 400;
            while (!done && pageCount < MAX_PAGES) {
                const result = await os.listData(recordName, cursor);
                if (!result?.success) {
                    const msg = result?.errorMessage || 'Failed to list data.';
                    setError(msg);
                    if (isAuthErrorMessage(msg)) setPermNeeded(true);
                    setHasMore(false);
                    break;
                }
                const pageItems = result.items || [];
                if (pageItems.length === 0) {
                    done = true;
                } else {
                    accumulated = accumulated.concat(pageItems);
                    cursor = pageItems[pageItems.length - 1].address;
                    const newTotal = result.totalCount ?? null;
                    if (newTotal != null && (items.length + accumulated.length) >= newTotal) {
                        done = true;
                    }
                }
                pageCount += 1;
            }
            if (accumulated.length > 0) {
                setItems(prev => prev.concat(accumulated));
                setLastAddress(accumulated[accumulated.length - 1].address);
            }
            if (pageCount >= MAX_PAGES) {
                setHasMore(true);
                os.toast && os.toast('Stopped early (too many pages). Refine your filter or continue manually.');
            } else {
                setHasMore(false);
            }
            setPermNeeded(false);
        } catch (err) {
            const msg = err?.message ?? String(err);
            setError(msg);
            if (isAuthErrorMessage(msg)) setPermNeeded(true);
            setHasMore(false);
        } finally {
            setLoadingAll(false);
        }
    }, [recordName, lastAddress, items.length, loadingAll]);

    const grantAdmin = useCallback(async () => {
        if (!recordName) {
            setError('Record name is required to grant permission.');
            return;
        }
        try {
            setGranting(true);
            const res = await os.grantInstAdminPermission(recordName);
            if (res?.success) {
                setPermNeeded(false);
                setItems([]);
                setTotalCount(null);
                setLastAddress(null);
                setHasMore(true);
                setError(null);
                await loadPage();
            } else {
                setError(res?.errorMessage || 'Failed to grant admin permission.');
            }
        } catch (e) {
            setError(e?.message ?? String(e));
        } finally {
            setGranting(false);
        }
    }, [recordName, loadPage]);

    const allMarkers = useMemo(() => {
        const s = new Set();
        for (const it of items) {
            if (Array.isArray(it.markers)) for (const m of it.markers) s.add(m);
        }
        return Array.from(s).sort();
    }, [items]);

    const filtered = useMemo(() => {
        const q = (query || '').toLowerCase().trim();
        const byMarker = markerFilter ? (it) => Array.isArray(it.markers) && it.markers.includes(markerFilter) : () => true;
        if (!q) return items.filter(byMarker);
        return items.filter(it => {
            if (!byMarker(it)) return false;
            const addr = String(it.address || '').toLowerCase();
            if (addr.includes(q)) return true;
            try {
                return JSON.stringify(it.data).toLowerCase().includes(q);
            } catch {
                return false;
            }
        });
    }, [items, query, markerFilter]);

    useEffect(() => {
        if (filtered.length === 0) setSelectedIndex(0);
        else if (selectedIndex >= filtered.length) setSelectedIndex(filtered.length - 1);
    }, [filtered.length, selectedIndex]);

    const selected = filtered[selectedIndex] || null;

    const copy = useCallback(async (text) => {
        try {
            await os.setClipboard(String(text));
            os.toast && os.toast('Copied to clipboard');
        } catch (e) {
            os.toast && os.toast('Copy failed');
        }
    }, []);

    // NEW: erase a single address (with confirmation)
    const eraseAddress = useCallback(async (address) => {
        if (!recordName || !address) return;
        const confirmed = await os.showConfirm({
            title: 'Erase data?',
            content: `This will permanently erase:\n${address}`,
            confirmText: 'Erase',
            cancelText: 'Cancel'
        });
        if (!confirmed) return;

        try {
            const res = await os.eraseData(recordName, address);
            if (res?.success) {
                setItems(prev => prev.filter(it => it.address !== address));
                setTotalCount(tc => (tc != null ? Math.max(0, tc - 1) : tc));
                os.toast && os.toast('Data erased.');
                setPermNeeded(false);
            } else {
                const msg = res?.errorMessage || 'Failed to erase data.';
                setError(msg);
                if (isAuthErrorMessage(msg)) setPermNeeded(true);
            }
        } catch (e) {
            const msg = e?.message ?? String(e);
            setError(msg);
            if (isAuthErrorMessage(msg)) setPermNeeded(true);
        }
    }, [recordName]);

    return {
        items, totalCount, hasMore, lastAddress,
        loading, loadingAll, granting, error, permNeeded,
        selected, selectedIndex,
        filtered, allMarkers, query, markerFilter,
        setSelectedIndex, setQuery, setMarkerFilter,
        loadPage, loadAll, grantAdmin, copy,
        eraseAddress, // <— expose
    };
}

function SidebarHeader(props) {
    const {
        itemsCount, totalCount, hasMore,
        onLoadMore, onLoadAll, loading, loadingAll,
        query, setQuery, markerFilter, setMarkerFilter, allMarkers
    } = props;

    return (
        <div className="sidebar-header">
            <div className="sidebar-toolbar">
                <span className="count">
                    {totalCount != null ? `${itemsCount} / ${totalCount} items` : `${itemsCount} items`}
                </span>
                <div style={{ display: 'flex', gap: '.75rem' }}>
                    {hasMore && <TextLink onClick={onLoadMore}>{loading ? 'Loading…' : 'Load more'}</TextLink>}
                    {hasMore && <TextLink onClick={onLoadAll}>{loadingAll ? 'Loading all…' : 'Load all'}</TextLink>}
                </div>
            </div>

            <input
                className="sidebar-search"
                placeholder="Filter by address or data…"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <select value={markerFilter} onChange={e => setMarkerFilter(e.target.value)}>
                <option value="">All markers</option>
                {allMarkers.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
        </div>
    );
}

function ListRow({ item, active, onClick }) {
    return (
        <div className={`row ${active ? 'active' : ''}`} onClick={onClick}>
            <div className="addr">{item.address}</div>
            {Array.isArray(item.markers) && item.markers.length > 0 && (
                <div className="badges">
                    {item.markers.map(m => <span key={m} className="badge">{m}</span>)}
                </div>
            )}
        </div>
    );
}

// updated: accept onErase and show "Erase data"
function DetailPanel({ selected, permNeeded, granting, recordName, grantAdmin, copy, onErase }) {
    return (
        <div className="detail">
            <div className="detail-header">
                <div className="addr">{selected ? selected.address : <span className="muted">Select an item</span>}</div>
                <div style={{display:'flex', gap:'.75rem'}}>
                    {selected && (
                        <>
                            <TextLink onClick={() => copy(selected.address)}>Copy address</TextLink>
                            <TextLink onClick={() => copy(JSON.stringify(selected.data, null, 2))}>Copy JSON</TextLink>
                            <TextLink onClick={() => onErase(selected.address)}>Erase data</TextLink>
                        </>
                    )}
                </div>
            </div>
            <div className="detail-body">
                {selected ? (
                    <>
                        {Array.isArray(selected.markers) && selected.markers.length > 0 && (
                            <p className="muted" style={{marginTop:0}}>markers: {selected.markers.join(', ')}</p>
                        )}
                        <pre className="data">{JSON.stringify(selected.data, null, 2)}</pre>
                    </>
                ) : (
                    <p className="muted">Choose an item from the list to view its data.</p>
                )}
            </div>

            {permNeeded && (
                <div className="callout" style={{margin: '.75rem'}}>
                    <p><strong>Access needed.</strong> Grant this inst admin access to <code>{recordName}</code> to list data.</p>
                    <TextLink onClick={grantAdmin}>{granting ? 'Granting…' : 'Grant admin to this inst'}</TextLink>
                </div>
            )}
        </div>
    );
}

const App = ({ recordName }) => {
    useEffect(() => {
        const onEscapeKeyPress = () => thisBot.unmount();
        thisBot.vars.onEscapeKeyPress.push(onEscapeKeyPress);
        return () => {
            const i = thisBot.vars.onEscapeKeyPress.findIndex(cb => cb === onEscapeKeyPress);
            if (i >= 0) thisBot.vars.onEscapeKeyPress.splice(i, 1);
        };
    }, []);

    const onBackgroundClick = useCallback(() => thisBot.unmount(), []);
    const onClose = useCallback(() => thisBot.unmount(), []);

    const state = useRecordBrowser(recordName);

    useEffect(() => {
        if (state.items.length === 0 && state.hasMore && !state.loading && recordName) {
            state.loadPage();
        }
    }, [recordName, state.items.length, state.hasMore, state.loading, state.loadPage]);

    return (
        <>
            <style>{css}</style>

            <AppContainer onBackgroundClick={onBackgroundClick}>
                <Window>
                    <p><TextLink onClick={onClose}>{'x Close'}</TextLink></p>
                    <h2>View Record</h2>
                    <p className='record-name'>Record Name: {recordName || <span className="muted">(none)</span>}</p>

                    {state.error && <p className="danger" style={{marginTop:'.25rem'}}>Error: {state.error}</p>}

                    <div className="layout" style={{marginTop:'.5rem'}}>
                        <div className="sidebar">
                            <SidebarHeader
                                itemsCount={state.items.length}
                                totalCount={state.totalCount}
                                hasMore={state.hasMore}
                                loading={state.loading}
                                loadingAll={state.loadingAll}
                                onLoadMore={state.loadPage}
                                onLoadAll={state.loadAll}
                                query={state.query}
                                setQuery={state.setQuery}
                                markerFilter={state.markerFilter}
                                setMarkerFilter={state.setMarkerFilter}
                                allMarkers={state.allMarkers}
                            />

                            <div className="sidebar-list">
                                {state.filtered.map((it, i) => (
                                    <ListRow
                                        key={it.address}
                                        item={it}
                                        active={i === state.selectedIndex}
                                        onClick={() => state.setSelectedIndex(i)}
                                    />
                                ))}
                                {state.filtered.length === 0 && <div className="row muted">No matches.</div>}
                            </div>
                        </div>

                        <DetailPanel
                            selected={state.selected}
                            permNeeded={state.permNeeded}
                            granting={state.granting}
                            recordName={recordName}
                            grantAdmin={state.grantAdmin}
                            copy={state.copy}
                            onErase={state.eraseAddress}
                        />
                    </div>
                </Window>
            </AppContainer>
        </>
    );
};

return App;