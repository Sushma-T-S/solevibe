import React from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { getOrderDisplay } from '../hooks/useOrderDisplay.jsx';

const TrackOrderModal = ({ order, onClose }) => {
  if (!order) return null;
  const { trackingTimeline = [], progressSteps, statusLabel, statusBadgeClass } = getOrderDisplay(order);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl max-h-[90vh] w-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Track Order #{order.orderId || order.orderGroupId}</h2>
            <div className="flex gap-2 items-center">
              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusBadgeClass}`}>
                {statusLabel}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition">
            <HiOutlineXMark className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Progress Timeline */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Progress</h3>
            <div className="flex items-center -space-x-2 mb-8">
              {progressSteps.slice(0,6).map((step, index) => (
                <React.Fragment key={step.status}>
                  <div className="flex flex-col items-center z-10">
                    <span className={`w-12 h-12 p-2.5 rounded-2xl shadow-lg flex items-center justify-center text-sm font-bold ring-4 ring-white/50 ${step.color}`}>
                      {step.icon}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 mt-2 px-1 min-w-[60px] text-center leading-tight">
                      {step.label}
                    </span>
                  </div>
                  {index < 5 && (
                    <div className={`flex-1 h-1 bg-gradient-to-r mx-2 rounded-full ${step.done || step.active ? 'bg-emerald-400 shadow-sm' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Tracking History */}
          {trackingTimeline.length > 0 ? (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Tracking History</h3>
              <div className="space-y-4">
                {trackingTimeline.map((track, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                    <div className={`w-3 h-3 rounded-full mt-2.5 flex-shrink-0 ring-2 ring-white shadow-sm ${statusBadgeClass.replace('text-', 'bg-')} ring-offset-2 ring-offset-slate-50`} />
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeClass}`}>
                          {track.status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {track.note && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                            {track.note}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 font-medium">{track.note || 'Status updated'}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(track.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No tracking updates yet</h3>
              <p className="text-slate-500">Tracking history will appear here as status changes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;

