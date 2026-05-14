import { ExpenseCategory, OrderStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  SALARY: "Salaires",
  RENT: "Loyer",
  FEED: "Aliments",
  VETERINARY: "Veterinaire",
  UTILITIES: "Eau / electricite",
  TRANSPORT: "Transport",
  MAINTENANCE: "Maintenance",
  PACKAGING: "Emballage",
  EQUIPMENT: "Equipement",
  TAX: "Taxes",
  OTHER: "Autre",
};

export function getCurrentMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return { start, end };
}

export function asNumber(value: unknown) {
  return Number(value ?? 0);
}

export async function getFinanceSummary() {
  const { start, end } = getCurrentMonthRange();
  const prisma = getPrisma();

  const [revenue, expenses, newOrders, activeEmployees, recentExpenses] =
    await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: start, lt: end },
          status: { not: OrderStatus.CANCELLED },
        },
        _sum: { subtotal: true },
      }),
      prisma.expense.aggregate({
        where: {
          deletedAt: null,
          expenseDate: { gte: start, lt: end },
        },
        _sum: { amount: true },
      }),
      prisma.order.count({
        where: { status: OrderStatus.NEW },
      }),
      prisma.employee.count({
        where: { isActive: true, deletedAt: null },
      }),
      prisma.expense.findMany({
        where: { deletedAt: null },
        include: { employee: true },
        orderBy: { expenseDate: "desc" },
        take: 5,
      }),
    ]);

  const revenueTotal = asNumber(revenue._sum.subtotal);
  const expenseTotal = asNumber(expenses._sum.amount);
  const netTotal = revenueTotal - expenseTotal;

  return {
    start,
    end,
    revenueTotal,
    expenseTotal,
    netTotal,
    isPositive: netTotal >= 0,
    newOrders,
    activeEmployees,
    recentExpenses,
  };
}
