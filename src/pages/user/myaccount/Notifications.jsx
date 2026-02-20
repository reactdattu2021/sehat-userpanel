import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { getAllNotificationsApi, getNotificationByIdApi } from "../../../apis/authapis";

const typeColors = {
    alert: { bg: "#FFF3CD", text: "#856404", dot: "#FFC107" },
    system: { bg: "#D1ECF1", text: "#0C5460", dot: "#17A2B8" },
    default: { bg: "#E9ECEF", text: "#495057", dot: "#6C757D" },
};

const formatIST = (date) =>
    new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
    });

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const limit = 10;

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await getAllNotificationsApi(currentPage, limit);
                if (res?.data?.success) {
                    setNotifications(res.data.data || []);
                    setTotalPages(res.data.totalpages || 1);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openDetail = async (id) => {
        try {
            setDetailLoading(true);
            const res = await getNotificationByIdApi(id);
            if (res?.data?.success) setDetail(res.data.data);
        } catch (err) {
            console.error("Failed to fetch notification:", err);
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading notifications...</p>;
    if (!notifications.length)
        return <p className="text-center mt-10">No notifications found</p>;

    return (
        <div>
            <h1 className="text-[28px] md:text-[36px] font-bold text-[#34658C] mb-6">
                Notifications
            </h1>

            <div className="flex flex-col gap-3">
                {notifications.map((n) => {
                    const colors = typeColors[n.notificationtype] || typeColors.default;
                    return (
                        <div
                            key={n._id}
                            onClick={() => openDetail(n._id)}
                            className="border border-gray-200 rounded-[12px] px-4 py-4 cursor-pointer hover:shadow-md transition-shadow bg-white flex items-start gap-3"
                        >
                            <span
                                className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: colors.dot }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <p className="font-semibold text-[15px] text-gray-800 truncate">
                                        {n.notificationtitle}
                                    </p>
                                    <span
                                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                                        style={{ backgroundColor: colors.bg, color: colors.text }}
                                    >
                                        {n.notificationtype}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                    {n.notificationmessage}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{formatIST(n.createdAt)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-3 rounded-lg font-semibold flex items-center justify-center ${currentPage === 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#34658C] text-white hover:bg-[#2a5270]"
                            }`}
                    >
                        <MdKeyboardArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-lg font-semibold ${currentPage === index + 1
                                        ? "bg-[#A2CD48] text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-3 rounded-lg font-semibold flex items-center justify-center ${currentPage === totalPages
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#34658C] text-white hover:bg-[#2a5270]"
                            }`}
                    >
                        <MdKeyboardArrowRight className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            {(detail || detailLoading) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setDetail(null)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-black"
                        >
                            <IoMdClose size={24} />
                        </button>

                        {detailLoading ? (
                            <p className="text-center py-8 text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-4">
                                    <span
                                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
                                        style={{
                                            backgroundColor:
                                                (typeColors[detail.notificationtype] || typeColors.default).bg,
                                            color:
                                                (typeColors[detail.notificationtype] || typeColors.default).text,
                                        }}
                                    >
                                        {detail.notificationtype}
                                    </span>
                                    <span
                                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
                                        style={{
                                            backgroundColor:
                                                detail.delivery_status === "sent" ? "#D4EDDA" : "#F8D7DA",
                                            color: detail.delivery_status === "sent" ? "#155724" : "#721C24",
                                        }}
                                    >
                                        {detail.delivery_status}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-[#34658C] mb-2">
                                    {detail.notificationtitle}
                                </h2>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                    {detail.notificationmessage}
                                </p>

                                <div className="text-xs text-gray-400 space-y-1">
                                    <p>Scheduled: {formatIST(detail.scheduletime)}</p>
                                    <p>Created: {formatIST(detail.createdAt)}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
