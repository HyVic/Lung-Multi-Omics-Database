// Initial user data for the application

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "curator" | "user";
  status: "active" | "pending" | "suspended";
  joined: string;
  datasets: number;
}

export const INIT_USERS: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@lungomics.org",
    password: "admin123",
    role: "admin",
    status: "active",
    joined: "2024-01-10",
    datasets: 5,
  },
  {
    id: 2,
    name: "Dr. Li Wei",
    email: "liwei@hospital.cn",
    password: "pass1234",
    role: "curator",
    status: "active",
    joined: "2024-03-22",
    datasets: 3,
  },
  {
    id: 3,
    name: "Zhang San",
    email: "zhangsan@uni.edu.cn",
    password: "pass1234",
    role: "user",
    status: "pending",
    joined: "2026-03-08",
    datasets: 0,
  },
  {
    id: 4,
    name: "Alice Chen",
    email: "alice@research.org",
    password: "pass1234",
    role: "user",
    status: "active",
    joined: "2025-11-01",
    datasets: 1,
  },
];

export function mkSamples(prefix: string, n: number, startAge: number, grp: string, tis: string) {
  return Array.from({ length: n }, function (_, i) {
    return {
      id: prefix + "_" + (i + 1),
      age: startAge + i * 2,
      sex: "F",
      group: grp,
      tissue: tis,
      disease: "Health",
      source: "GEO: SAMC" + (2509412 + i * 4),
      rin: (7.2 + Math.random()).toFixed(1),
      reads:
        42 +
        Math.round(Math.random() * 18) +
        "." +
        Math.round(Math.random() * 9) +
        "M",
    };
  });
}
