import { useState, useEffect } from "react";
import { ServiceRequest, RequestStatus } from "../types/request";
import { Notification } from "../components/notifications/notification-badge";

// Mock customer requests
const createMockRequests = (): ServiceRequest[] => [
  {
    id: "req-001",
    requestNumber: "OT-2024-001",
    customerId: "cust-001",
    customerName: "Ahmet Yılmaz",
    shopId: "shop-001",
    shopName: "ProTech Oto Tamir",
    vehicle: {
      brand: "Toyota",
      model: "Corolla",
      year: "2020",
      mileage: "85000",
    },
    issueDescription: "Aracımda fren sesi var. Frene bastığımda tiz bir ses geliyor. Ayrıca motor ısınması normalden yüksek seyrediyor.",
    selectedIssues: ["Fren Sorunu", "Motor Arızası"],
    status: "in_progress" as RequestStatus,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    estimatedPrice: "₺2.500 - ₺3.500",
    messages: [
      {
        id: "msg-001",
        sender: "customer",
        content: "Merhaba, ne zaman gelebilirim?",
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
      },
      {
        id: "msg-002",
        sender: "business",
        content: "Merhaba Ahmet Bey, ekspertiz sonuçlarını yükledik. Fren balataları değişmeli ve motor suyu kaçağı var. Onayınız ile işleme başlayabiliriz.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        attachments: [
          {
            type: "image",
            url: "/photos/brake-inspection.jpg",
            name: "Fren Ekspertizi.jpg",
          },
        ],
      },
    ],
    timeline: [
      {
        status: "pending" as RequestStatus,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        note: "Talep oluşturuldu",
      },
      {
        status: "approved" as RequestStatus,
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        note: "İşletme talebinizi onayladı",
      },
      {
        status: "in_progress" as RequestStatus,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        note: "İşleme alındı. Ekspertiz yapılıyor.",
      },
    ],
  },
  {
    id: "req-002",
    requestNumber: "OT-2024-002",
    customerId: "cust-001",
    customerName: "Ahmet Yılmaz",
    shopId: "shop-002",
    shopName: "MasterCar Oto Servis",
    vehicle: {
      brand: "Honda",
      model: "Civic",
      year: "2019",
      mileage: "120000",
    },
    issueDescription: "Periyodik bakım zamanı geldi. Yağ ve filtre değişimi gerekiyor.",
    selectedIssues: ["Periyodik Bakım"],
    status: "pending" as RequestStatus,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    messages: [],
    timeline: [
      {
        status: "pending" as RequestStatus,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        note: "Talep oluşturuldu",
      },
    ],
  },
  {
    id: "req-003",
    requestNumber: "OT-2024-003",
    customerId: "cust-001",
    customerName: "Ahmet Yılmaz",
    shopId: "shop-003",
    shopName: "Elit Oto Kaporta",
    vehicle: {
      brand: "BMW",
      model: "320i",
      year: "2021",
      mileage: "45000",
    },
    issueDescription: "Sağ arka çamurlukta ezik var. Boya işlemi gerekiyor.",
    selectedIssues: ["Kaporta Hasarı", "Boya İşlemi"],
    status: "completed" as RequestStatus,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    actualPrice: "₺4.500",
    messages: [],
    timeline: [
      {
        status: "pending" as RequestStatus,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        status: "approved" as RequestStatus,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        status: "in_progress" as RequestStatus,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        status: "completed" as RequestStatus,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        note: "İşlem tamamlandı. Aracınızı teslim alabilirsiniz.",
      },
    ],
  },
];

// Mock business requests
const createMockBusinessRequests = (): ServiceRequest[] => [
  {
    id: "req-101",
    requestNumber: "OT-2024-101",
    customerId: "cust-101",
    customerName: "Mehmet Demir",
    shopId: "shop-001",
    shopName: "ProTech Oto Tamir",
    vehicle: {
      brand: "Renault",
      model: "Megane",
      year: "2018",
      mileage: "150000",
    },
    issueDescription: "Klima soğutmuyor ve direksiyon hakimiyeti zorlaştı.",
    selectedIssues: ["Klima Arızası", "Direksiyon Sorunu"],
    status: "pending" as RequestStatus,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    messages: [],
    timeline: [
      {
        status: "pending" as RequestStatus,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "req-102",
    requestNumber: "OT-2024-102",
    customerId: "cust-102",
    customerName: "Ayşe Kaya",
    shopId: "shop-001",
    shopName: "ProTech Oto Tamir",
    vehicle: {
      brand: "Volkswagen",
      model: "Golf",
      year: "2020",
      mileage: "65000",
    },
    issueDescription: "Motor arıza lambası yandı. Gaz pedalına bastığımda aracın gücü düşüyor.",
    selectedIssues: ["Motor Arızası", "Elektrik Arızası"],
    status: "approved" as RequestStatus,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messages: [],
    timeline: [
      {
        status: "pending" as RequestStatus,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        status: "approved" as RequestStatus,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
];

// Mock notifications
const createMockNotifications = (userType: "customer" | "business"): Notification[] => {
  if (userType === "customer") {
    return [
      {
        id: "notif-001",
        type: "new_message",
        title: "Yeni Mesaj",
        message: "ProTech Oto Tamir size bir mesaj gönderdi",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        requestId: "req-001",
      },
      {
        id: "notif-002",
        type: "request_update",
        title: "Talep Güncellendi",
        message: "Talebiniz #OT-2024-001 işleme alındı",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
        requestId: "req-001",
      },
    ];
  } else {
    return [
      {
        id: "notif-101",
        type: "request_update",
        title: "Yeni Talep",
        message: "Mehmet Demir yeni bir talep oluşturdu",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        requestId: "req-101",
      },
    ];
  }
};

export function useMockData(userType: "customer" | "business") {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (userType === "customer") {
      setRequests(createMockRequests());
    } else {
      setRequests(createMockBusinessRequests());
    }
    setNotifications(createMockNotifications(userType));
  }, [userType]);

  const updateRequestStatus = (
    requestId: string,
    status: RequestStatus,
    note?: string
  ) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status,
              updatedAt: new Date(),
              timeline: [
                ...req.timeline,
                {
                  status,
                  timestamp: new Date(),
                  note,
                },
              ],
            }
          : req
      )
    );
  };

  const addMessage = (requestId: string, content: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              messages: [
                ...req.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender: userType === "customer" ? "customer" : "business",
                  content,
                  timestamp: new Date(),
                },
              ],
            }
          : req
      )
    );
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return {
    requests,
    notifications,
    updateRequestStatus,
    addMessage,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
}
