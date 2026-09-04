using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Student_Housing_Platform.Migrations
{
    /// <inheritdoc />
    public partial class BookingApprovalWorkflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovalDeadline",
                table: "Bookings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DurationMonths",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Bookings",
                type: "nvarchar(320)",
                maxLength: 320,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "FinalReminderSent",
                table: "Bookings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Mobile",
                table: "Bookings",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NationalId",
                table: "Bookings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Bookings",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StudentName",
                table: "Bookings",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UniversityId",
                table: "Bookings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("""
                IF OBJECT_ID(N'[ContactMessages]', N'U') IS NULL
                BEGIN
                    CREATE TABLE [ContactMessages] (
                        [Id] int NOT NULL IDENTITY,
                        [Name] nvarchar(150) NOT NULL,
                        [Email] nvarchar(200) NOT NULL,
                        [Phone] nvarchar(30) NULL,
                        [Subject] nvarchar(200) NULL,
                        [Message] nvarchar(2000) NOT NULL,
                        [UserId] nvarchar(450) NULL,
                        [IsRead] bit NOT NULL,
                        [CreatedAt] datetime2 NOT NULL,
                        CONSTRAINT [PK_ContactMessages] PRIMARY KEY ([Id]),
                        CONSTRAINT [FK_ContactMessages_AspNetUsers_UserId]
                            FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id])
                    );
                END
                IF NOT EXISTS (
                    SELECT 1 FROM sys.indexes
                    WHERE name = N'IX_ContactMessages_UserId'
                      AND object_id = OBJECT_ID(N'[ContactMessages]')
                )
                BEGIN
                    CREATE INDEX [IX_ContactMessages_UserId]
                        ON [ContactMessages] ([UserId]);
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactMessages");

            migrationBuilder.DropColumn(
                name: "ApprovalDeadline",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "DurationMonths",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "FinalReminderSent",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Mobile",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "NationalId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "StudentName",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UniversityId",
                table: "Bookings");
        }
    }
}
