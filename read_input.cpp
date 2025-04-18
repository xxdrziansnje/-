#include "common.h"

// ��ȡ��������Ĳ˵�ѡ����кϷ���У��
char readMenuSelection(int options)
{
	string str;

	while (true)
	{
		getline(cin, str);

		// ���кϷ���У��
		if (str.size() != 1 || str[0] - '0' <= 0 || str[0] - '0' > options)
			cout << "�������������ѡ��";
		else
			break;
	}

	// ����Ϸ�
	return str[0];
}

// ��ȡȷ���˳���Ϣ�������кϷ���У��
char readQuitConfirm()
{
	string str;

	while (true)
	{
		getline(cin, str);

		// ���кϷ���У��
		if (str.size() != 1 || toupper(str[0]) != 'Y' && toupper(str[0]) != 'N')
			cout << "����������������루Y/N����";
		else
			break;
	}

	// ����Ϸ�
	return toupper(str[0]);
}

// ��ȡ��������Ľ�����������Ϸ���У��
int readAmount()
{
	int amount;

	string str;
	while (true)
	{
		getline(cin, str);

		// ���кϷ���У��
		try 
		{
			amount = stoi(str);
			break;
		}
		catch (invalid_argument e)
		{
			cout << "�����������ȷ�������֣�";
		}
	}

	// ����Ϸ�
	return amount;
}